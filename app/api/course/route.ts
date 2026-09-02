import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { checkAdmin, checkAuth } from '@/app/lib/dal';
import { courseSchema } from '@/app/lib/validation';

export async function GET() {
  const isAuth = await checkAuth();

  if (!isAuth) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
  }

  try {
    const courses = await prisma.course.findMany({
      orderBy: { number: 'asc' },
      include: {
        lessons: {
          select: { id: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: courses });
  } catch {
    return NextResponse.json({ success: false, error: 'Ошибка загрузки курсов' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = await checkAdmin();

  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Недостаточно прав' }, { status: 403 });
  }

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
      where: { slug: result.data.slug },
    });

    if (existingCourse) {
      return NextResponse.json(
        { success: false, error: 'Курс с таким slug уже существует' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: course }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
