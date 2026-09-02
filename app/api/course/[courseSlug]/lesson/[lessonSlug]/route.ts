import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { checkAdmin, checkAuth } from '@/app/lib/dal';
import { lessonSchema } from '@/app/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }
) {
  const isAuth = await checkAuth();

  if (!isAuth) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  const { courseSlug, lessonSlug } = await params;

  try {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      return NextResponse.json({ success: false, error: 'Курс не найден' }, { status: 404 });
    }

    const lesson = await prisma.lesson.findFirst({
      where: {
        courseId: course.id,
        slug: lessonSlug,
      },
      include: {
        files: {
          orderBy: { number: 'asc' },
        },
      },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Урок не найден' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lesson });
  } catch {
    return NextResponse.json({ success: false, error: 'Ошибка загрузки урока' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string; lessonSlug: string }> }
) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Недостаточно прав' }, { status: 403 });
  }

  const { courseSlug, lessonSlug } = await params;

  try {
    const body = await request.json();
    const result = lessonSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      return NextResponse.json({ success: false, error: 'Курс не найден' }, { status: 404 });
    }

    const existingLesson = await prisma.lesson.findFirst({
      where: {
        courseId: course.id,
        slug: lessonSlug,
      },
    });

    if (!existingLesson) {
      return NextResponse.json({ success: false, error: 'Урок не найден' }, { status: 404 });
    }

    if (result.data.slug !== lessonSlug) {
      const slugExists = await prisma.lesson.findFirst({
        where: {
          courseId: course.id,
          slug: result.data.slug,
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Урок с таким slug уже существует в этом курсе' },
          { status: 400 }
        );
      }
    }

    const lesson = await prisma.lesson.update({
      where: { id: existingLesson.id },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: lesson });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
