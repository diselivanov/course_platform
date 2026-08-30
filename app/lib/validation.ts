import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().min(3, 'Некорректное имя').max(32, 'Некорректное имя'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(5, 'Некорректный пароль').max(200, 'Некорректный пароль'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(5, 'Некорректный пароль').max(200, 'Некорректный пароль'),
});

export const updateProfileSchema = {
  name: z.object({
    name: z.string().min(3, 'Некорректное имя').max(32, 'Некорректное имя'),
  }),
  email: z.object({
    email: z.string().email('Некорректный email'),
  }),
  password: z
    .object({
      currentPassword: z.string().min(5, 'Некорректный пароль'),
      newPassword: z.string().min(5, 'Некорректный пароль').max(200, 'Некорректный пароль'),
      confirmPassword: z.string(),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    }),
};

export const courseSchema = z.object({
  number: z.number().int().positive(),
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  youtubeUrl: z.string().optional(),
  vkUrl: z.string().optional(),
});

export const lessonSchema = z.object({
  number: z.number().int().positive(),
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  youtubeUrl: z.string().optional(),
  vkUrl: z.string().optional(),
  description: z.string().optional(),
});

export const fileSchema = z.object({
  number: z.number().int().positive(),
  title: z.string().min(1).max(255),
  status: z.enum(['NEW', 'EDITED', 'DELETED']),
  oldCode: z.string().optional(),
  newCode: z.string().optional(),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type NameFormData = z.infer<typeof updateProfileSchema.name>;
export type EmailFormData = z.infer<typeof updateProfileSchema.email>;
export type PasswordFormData = z.infer<typeof updateProfileSchema.password>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type LessonFormData = z.infer<typeof lessonSchema>;
export type FileFormData = z.infer<typeof fileSchema>;
