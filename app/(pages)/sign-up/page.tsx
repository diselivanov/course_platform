'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { useAlert } from '@/app/components/Alert';
import { signUpSchema, SignUpFormData } from '@/app/lib/validation';
import styles from './page.module.scss';

export default function SignUpPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка регистрации');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      showAlert('error', 'Ошибка соединения с сервером');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.title}>Регистрация</h2>

        <Input label="Имя" type="text" error={errors.name?.message} {...register('name')} />

        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />

        <Input
          label="Пароль"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Подтвердите пароль"
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth loading={isSubmitting}>
          Зарегистрироваться
        </Button>

        <p className={styles.footer}>
          Уже есть аккаунт? <Link href="/sign-in">Войти</Link>
        </p>
      </form>
    </div>
  );
}