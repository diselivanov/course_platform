'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fileSchema, FileFormData } from '@/app/lib/validation';
import Input from '@/app/components/Input';
import Textarea from '@/app/components/Textarea';
import Button from '@/app/components/Button';
import { useAlert } from '@/app/components/Alert';
import styles from './page.module.scss';

interface EditFilePageProps {
  params: Promise<{ courseSlug: string; lessonSlug: string; fileId: string }>;
}

export default function EditFilePage({ params }: EditFilePageProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [courseSlug, setCourseSlug] = useState<string>('');
  const [lessonSlug, setLessonSlug] = useState<string>('');
  const [fileId, setFileId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FileFormData>({
    resolver: zodResolver(fileSchema),
  });

  useEffect(() => {
    params.then(p => {
      setCourseSlug(p.courseSlug);
      setLessonSlug(p.lessonSlug);
      setFileId(p.fileId);
    });
  }, [params]);

  useEffect(() => {
    if (!courseSlug || !lessonSlug || !fileId) return;

    const loadFile = async () => {
      try {
        const response = await fetch(
          `/api/course/${courseSlug}/lesson/${lessonSlug}/file/${fileId}`
        );

        if (!response.ok) {
          showAlert('error', 'Ошибка загрузки файла');
          router.push(`/course/${courseSlug}?lesson=${lessonSlug}`);
          return;
        }

        const result = await response.json();
        const data = result.data;

        setValue('number', data.number);
        setValue('title', data.title);
        setValue('status', data.status);
        setValue('oldCode', data.oldCode);
        setValue('newCode', data.newCode);
      } catch {
        showAlert('error', 'Ошибка соединения с сервером');
        router.push(`/course/${courseSlug}?lesson=${lessonSlug}`);
      }
    };

    loadFile();
  }, [courseSlug, lessonSlug, fileId, router, setValue, showAlert]);

  const onSubmit = async (data: FileFormData) => {
    try {
      const response = await fetch(
        `/api/course/${courseSlug}/lesson/${lessonSlug}/file/${fileId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка обновления');
        return;
      }

      router.push(`/course/${courseSlug}?lesson=${lessonSlug}`);
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
      <h1 className={styles.title}>Редактирование файла</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Input
          label="Номер"
          type="number"
          {...register('number', { valueAsNumber: true })}
          error={errors.number?.message}
        />
        <Input label="Название" {...register('title')} error={errors.title?.message} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label className={styles.label}>Статус</label>
          <select {...register('status')} className={styles.select}>
            <option value="NEW">Новый</option>
            <option value="EDITED">Изменен</option>
            <option value="DELETED">Удален</option>
          </select>
          {errors.status && <span className={styles.errorText}>{errors.status.message}</span>}
        </div>
        <Textarea label="Старый код" {...register('oldCode')} error={errors.oldCode?.message} />
        <Textarea label="Новый код" {...register('newCode')} error={errors.newCode?.message} />
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
