'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema } from '@/app/lib/validation';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import { useAlert } from '@/app/components/Alert';
import ConfirmModal from '@/app/components/ConfirmModal';
import styles from './page.module.scss';

interface NameFormData {
  name: string;
}

interface EmailFormData {
  email: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [isLoadingName, setIsLoadingName] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const nameForm = useForm<NameFormData>({
    resolver: zodResolver(updateProfileSchema.name),
    defaultValues: { name: '' },
  });

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(updateProfileSchema.email),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(updateProfileSchema.password),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const loadUser = async () => {
      const response = await fetch('/api/user/profile');
      const result = await response.json();
      if (result.success && result.data) {
        nameForm.setValue('name', result.data.name || '');
        emailForm.setValue('email', result.data.email || '');
      }
    };
    loadUser();
  }, [nameForm, emailForm]);

  const onNameSubmit = async (data: NameFormData) => {
    setIsLoadingName(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name }),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка обновления');
        return;
      }

      showAlert('success', 'Имя обновлено');
      router.refresh();
    } catch {
      showAlert('error', 'Ошибка соединения с сервером');
    } finally {
      setIsLoadingName(false);
    }
  };

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoadingEmail(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка обновления');
        return;
      }

      showAlert('success', 'Email обновлен');
      router.refresh();
    } catch {
      showAlert('error', 'Ошибка соединения с сервером');
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoadingPassword(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка обновления');
        return;
      }

      showAlert('success', 'Пароль обновлен');
      passwordForm.reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      router.refresh();
    } catch {
      showAlert('error', 'Ошибка соединения с сервером');
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const handleSignOut = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSignOut = () => {
    setIsConfirmOpen(false);
    window.location.href = '/api/auth/sign-out';
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Основное</h2>
        <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className={styles.form}>
          <Input
            label="Имя"
            {...nameForm.register('name')}
            error={nameForm.formState.errors.name?.message}
          />
          <Button type="submit" loading={isLoadingName}>
            Сохранить
          </Button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Email</h2>
        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className={styles.form}>
          <Input
            label="Email"
            {...emailForm.register('email')}
            error={emailForm.formState.errors.email?.message}
          />
          <Button type="submit" loading={isLoadingEmail}>
            Сохранить
          </Button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Пароль</h2>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className={styles.form}>
          <Input
            label="Текущий пароль"
            type="password"
            {...passwordForm.register('currentPassword')}
            error={passwordForm.formState.errors.currentPassword?.message}
          />
          <Input
            label="Новый пароль"
            type="password"
            {...passwordForm.register('newPassword')}
            error={passwordForm.formState.errors.newPassword?.message}
          />
          <Input
            label="Новый пароль ещё раз"
            type="password"
            {...passwordForm.register('confirmPassword')}
            error={passwordForm.formState.errors.confirmPassword?.message}
          />
          <Button type="submit" loading={isLoadingPassword}>
            Сохранить
          </Button>
        </form>
      </div>

      <Button variant="secondary" onClick={handleSignOut}>
        Выйти из аккаунта
      </Button>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Выход из аккаунта"
        description="Вы уверены, что хотите выйти?"
        confirmText="Выйти"
        onConfirm={handleConfirmSignOut}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
