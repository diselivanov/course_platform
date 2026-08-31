'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { useAlert } from '@/app/components/Alert';
import { signInSchema, SignInFormData } from '@/app/lib/validation';
import styles from './page.module.scss';

export default function SignInPage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка входа');
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
        <h2 className={styles.title}>Вход</h2>

        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />

        <Input
          label="Пароль"
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" fullWidth loading={isSubmitting}>
          Войти
        </Button>

        <p className={styles.footer}>
          Нет аккаунта? <Link href="/sign-up">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}
