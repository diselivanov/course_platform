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

interface EditLessonPageProps {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}

export default function EditLessonPage({ params }: EditLessonPageProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [courseSlug, setCourseSlug] = useState<string>('');
  const [lessonSlug, setLessonSlug] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
  });

  useEffect(() => {
    params.then(p => {
      setCourseSlug(p.courseSlug);
      setLessonSlug(p.lessonSlug);
    });
  }, [params]);

  useEffect(() => {
    if (!courseSlug || !lessonSlug) return;

    const loadLesson = async () => {
      try {
        const response = await fetch(`/api/course/${courseSlug}/lesson/${lessonSlug}`);
        const result = await response.json();

        if (!response.ok) {
          showAlert('error', result.error || 'Ошибка загрузки');
          router.push(`/course/${courseSlug}`);
          return;
        }

        const data = result.data;
        setValue('number', data.number);
        setValue('title', data.title);
        setValue('slug', data.slug);
        setValue('youtubeUrl', data.youtubeUrl || '');
        setValue('vkUrl', data.vkUrl || '');
        setValue('description', data.description || '');
      } catch {
        showAlert('error', 'Ошибка соединения с сервером');
        router.push(`/course/${courseSlug}`);
      }
    };

    loadLesson();
  }, [courseSlug, lessonSlug, router, setValue, showAlert]);

  const onSubmit = async (data: LessonFormData) => {
    try {
      const response = await fetch(`/api/course/${courseSlug}/lesson/${lessonSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка обновления');
        return;
      }

      router.push(`/course/${courseSlug}?lesson=${result.data.slug}`);
      router.refresh();
    } catch {
      showAlert('error', 'Ошибка соединения с сервером');
    }
  };

  const handleCancel = () => {
    router.push(`/course/${courseSlug}?lesson=${lessonSlug}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Редактирование урока</h1>
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
        <div className={styles.actions}>
          <Button type="button" fullWidth variant="secondary" onClick={handleCancel}>
            Отмена
          </Button>
          <Button type="submit" fullWidth loading={isSubmitting}>
            Сохранить
          </Button>
        </div>
      </form>
    </div>
  );
}
