import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getSession } from '@/app/lib/dal';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Необходима авторизация' }, { status: 401 });
  }

  try {
    const { lessonId } = await params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true },
    });

    if (!lesson) {
      return NextResponse.json({ success: false, error: 'Урок не найден' }, { status: 404 });
    }

    await prisma.userProgress.create({
      data: {
        userId: session.userId,
        lessonId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Урок уже отмечен' }, { status: 409 });
    }

    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ success: false, error: 'Необходима авторизация' }, { status: 401 });
  }

  try {
    const { lessonId } = await params;

    await prisma.userProgress.delete({
      where: {
        userId_lessonId: {
          userId: session.userId,
          lessonId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Прогресс не найден' }, { status: 404 });
    }

    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
