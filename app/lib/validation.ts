import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().min(3, 'Некорректное имя').max(32, 'Некорректное имя'),
    email: z.string().email('Некорректный email'),
    password: z
      .string()
      .min(5, 'Некорректный пароль')
      .max(200, 'Некорректный пароль'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z
    .string()
    .min(5, 'Некорректный пароль')
    .max(200, 'Некорректный пароль'),
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
      newPassword: z
        .string()
        .min(5, 'Некорректный пароль')
        .max(200, 'Некорректный пароль'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    }),
};

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type NameFormData = z.infer<typeof updateProfileSchema.name>;
export type EmailFormData = z.infer<typeof updateProfileSchema.email>;
export type PasswordFormData = z.infer<typeof updateProfileSchema.password>;
