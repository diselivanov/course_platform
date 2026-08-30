'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, CourseFormData } from '@/app/lib/validation';
import Input from '@/app/components/Input';
import Textarea from '@/app/components/Textarea';
import Button from '@/app/components/Button';
import { useAlert } from '@/app/components/Alert';
import styles from './page.module.scss';

export default function CreateCoursePage() {
  const router = useRouter();
  const { showAlert } = useAlert();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      number: 1,
      youtubeUrl: '',
      vkUrl: '',
    },
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      const response = await fetch('/api/course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка создания курса');
        return;
      }

      router.push(`/course/${result.data.slug}`);
      router.refresh();
    } catch {
      showAlert('error', 'Ошибка соединения с сервером');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Создание курса</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Номер"
          type="number"
          {...register('number', { valueAsNumber: true })}
          error={errors.number?.message}
        />
        <Input label="Название" {...register('title')} error={errors.title?.message} />
        <Input label="Slug" {...register('slug')} error={errors.slug?.message} />
        <Textarea
          label="Краткое описание"
          {...register('shortDescription')}
          error={errors.shortDescription?.message}
        />
        <Textarea
          label="Полное описание (HTML)"
          {...register('fullDescription')}
          error={errors.fullDescription?.message}
        />
        <Input label="YouTube" {...register('youtubeUrl')} error={errors.youtubeUrl?.message} />
        <Input label="VK Видео" {...register('vkUrl')} error={errors.vkUrl?.message} />
        <Button type="submit" fullWidth loading={isSubmitting}>
          Создать
        </Button>
      </form>
    </div>
  );
}
