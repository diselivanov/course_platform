'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, CourseFormData } from '@/app/lib/validation';
import Input from '@/app/components/Input';
import Textarea from '@/app/components/Textarea';
import Button from '@/app/components/Button';
import { useAlert } from '@/app/components/Alert';
import styles from './page.module.scss';

interface EditCoursePageProps {
  params: Promise<{ courseSlug: string }>;
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [courseSlug, setCourseSlug] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
  });

  useEffect(() => {
    params.then(p => setCourseSlug(p.courseSlug));
  }, [params]);

  useEffect(() => {
    if (!courseSlug) return;

    const loadCourse = async () => {
      try {
        const response = await fetch(`/api/course/${courseSlug}`);
        const result = await response.json();

        if (!response.ok) {
          showAlert('error', result.error || 'Ошибка загрузки');
          router.push('/');
          return;
        }

        const data = result.data;
        setValue('number', data.number);
        setValue('title', data.title);
        setValue('slug', data.slug);
        setValue('shortDescription', data.shortDescription);
        setValue('fullDescription', data.fullDescription);
        setValue('youtubeUrl', data.youtubeUrl || '');
        setValue('vkUrl', data.vkUrl || '');
      } catch {
        showAlert('error', 'Ошибка соединения с сервером');
        router.push('/');
      }
    };

    loadCourse();
  }, [courseSlug, router, setValue, showAlert]);

  const onSubmit = async (data: CourseFormData) => {
    try {
      const response = await fetch(`/api/course/${courseSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка обновления');
        return;
      }

      router.push(`/course/${result.data.slug}`);
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
      <h1 className={styles.title}>Редактирование курса</h1>
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
          Сохранить
        </Button>
        <Button type="button" fullWidth variant="secondary" onClick={handleCancel}>
          Отмена
        </Button>
      </form>
    </div>
  );
}
