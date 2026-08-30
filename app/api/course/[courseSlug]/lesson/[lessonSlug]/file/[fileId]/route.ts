import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { checkAdmin } from '@/app/lib/dal';
import { fileSchema } from '@/app/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string; lessonSlug: string; fileId: string }> }
) {
  const { courseSlug, lessonSlug, fileId } = await params;

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
      select: { id: true },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Урок не найден' }, { status: 404 });
    }

    const file = await prisma.lessonFile.findFirst({
      where: {
        id: fileId,
        lessonId: lesson.id,
      },
    });

    if (!file) {
      return NextResponse.json({ success: false, error: 'Файл не найден' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: file });
  } catch {
    return NextResponse.json({ success: false, error: 'Ошибка загрузки файла' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string; lessonSlug: string; fileId: string }> }
) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Недостаточно прав' }, { status: 403 });
  }

  const { courseSlug, lessonSlug, fileId } = await params;

  try {
    const body = await request.json();
    const result = fileSchema.safeParse(body);

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

    const lesson = await prisma.lesson.findFirst({
      where: {
        courseId: course.id,
        slug: lessonSlug,
      },
      select: { id: true },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Урок не найден' }, { status: 404 });
    }

    const existingFile = await prisma.lessonFile.findFirst({
      where: {
        id: fileId,
        lessonId: lesson.id,
      },
    });

    if (!existingFile) {
      return NextResponse.json({ success: false, error: 'Файл не найден' }, { status: 404 });
    }

    const file = await prisma.lessonFile.update({
      where: { id: fileId },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: file });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string; lessonSlug: string; fileId: string }> }
) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Недостаточно прав' }, { status: 403 });
  }

  const { courseSlug, lessonSlug, fileId } = await params;

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
      select: { id: true },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Урок не найден' }, { status: 404 });
    }

    const existingFile = await prisma.lessonFile.findFirst({
      where: {
        id: fileId,
        lessonId: lesson.id,
      },
    });

    if (!existingFile) {
      return NextResponse.json({ success: false, error: 'Файл не найден' }, { status: 404 });
    }

    await prisma.lessonFile.delete({
      where: { id: fileId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
