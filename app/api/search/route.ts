import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();

  if (!q || q.length === 0) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        OR: [{ title: { contains: q } }, { description: { contains: q } }],
      },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      take: 20,
    });

    const results = lessons.map(lesson => {
      const titleMatch = lesson.title.toLowerCase().includes(q.toLowerCase());
      const descriptionMatch = lesson.description?.toLowerCase().includes(q.toLowerCase());
      let relevance = 0;
      if (titleMatch) relevance += 10;
      if (descriptionMatch) relevance += 1;
      return { ...lesson, relevance };
    });

    results.sort((a, b) => b.relevance - a.relevance);

    return NextResponse.json({ success: true, data: results });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}
