import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    return { userId: decoded.userId };
  } catch {
    return null;
  }
});

export const getUser = cache(async () => {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
});

export const checkAuth = cache(async () => {
  const session = await getSession();
  return !!session;
});

export const checkAdmin = cache(async () => {
  const user = await getUser();
  return user?.role === 'ADMIN';
});
