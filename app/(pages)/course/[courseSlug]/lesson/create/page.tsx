'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { lessonSchema, LessonFormData } from '@/app/lib/validation';
import Input from '@/app/components/Input';
import Textarea from '@/app/components/Textarea';
import Button from '@/app/components/Button';
import { useAlert } from '@/app/components/Alert';
import styles from './page.module.scss';

interface CreateLessonPageProps {
  params: Promise<{ courseSlug: string }>;
}

export default function CreateLessonPage({ params }: CreateLessonPageProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [courseSlug, setCourseSlug] = useState<string>('');

  useEffect(() => {
    params.then(p => setCourseSlug(p.courseSlug));
  }, [params]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      number: 1,
      youtubeUrl: '',
      vkUrl: '',
      description: '',
    },
  });

  const onSubmit = async (data: LessonFormData) => {
    try {
      const response = await fetch(`/api/course/${courseSlug}/lesson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка создания урока');
        return;
      }

      router.push(`/course/${courseSlug}?lesson=${result.data.slug}`);
      router.refresh();
    } catch {
      showAlert('error', 'Ошибка соединения с сервером');
    }
  };

  const handleCancel = () => {
    router.push(`/course/${courseSlug}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Создание урока</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Номер"
          type="number"
          {...register('number', { valueAsNumber: true })}
          error={errors.number?.message}
        />
        <Input label="Название" {...register('title')} error={errors.title?.message} />
        <Input label="Slug" {...register('slug')} error={errors.slug?.message} />
        <Input label="YouTube" {...register('youtubeUrl')} error={errors.youtubeUrl?.message} />
        <Input label="VK Видео" {...register('vkUrl')} error={errors.vkUrl?.message} />
        <Textarea
          label="Описание (HTML)"
          {...register('description')}
          error={errors.description?.message}
        />
        <Button type="submit" fullWidth loading={isSubmitting}>
          Создать
        </Button>
        <Button type="button" fullWidth variant="secondary" onClick={handleCancel}>
          Отмена
        </Button>
      </form>
    </div>
  );
}
