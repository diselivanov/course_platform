import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { checkAdmin, checkAuth } from '@/app/lib/dal';
import { courseSchema } from '@/app/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  const isAuth = await checkAuth();

  if (!isAuth) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  const { courseSlug } = await params;

  try {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        lessons: {
          orderBy: { number: 'asc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ success: false, error: 'Курс не найден' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: course });
  } catch {
    return NextResponse.json({ success: false, error: 'Ошибка загрузки курса' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Недостаточно прав' }, { status: 403 });
  }

  const { courseSlug } = await params;

  try {
    const body = await request.json();
    const result = courseSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const existingCourse = await prisma.course.findUnique({
      where: { slug: courseSlug },
    });

    if (!existingCourse) {
      return NextResponse.json({ success: false, error: 'Курс не найден' }, { status: 404 });
    }

    if (result.data.slug !== courseSlug) {
      const slugExists = await prisma.course.findUnique({
        where: { slug: result.data.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Курс с таким slug уже существует' },
          { status: 400 }
        );
      }
    }

    const course = await prisma.course.update({
      where: { slug: courseSlug },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: course });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
