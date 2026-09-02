import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { checkAuth, getSession } from '@/app/lib/dal';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseSlug: string }> }
) {
  try {
    const isAuth = await checkAuth();

    if (!isAuth) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }

    const { courseSlug } = await params;
    const session = await getSession();

    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      include: {
        lessons: {
          orderBy: { number: 'asc' },
          select: {
            id: true,
            number: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ success: false, error: 'Курс не найден' }, { status: 404 });
    }

    let completedIds: string[] = [];

    if (session) {
      const progress = await prisma.userProgress.findMany({
        where: {
          userId: session.userId,
          lesson: {
            courseId: course.id,
          },
        },
        select: {
          lessonId: true,
        },
      });
      completedIds = progress.map(p => p.lessonId);
    }

    return NextResponse.json({
      success: true,
      data: {
        lessons: course.lessons,
        completedIds,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
