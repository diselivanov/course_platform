'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DiffView as GitDiffView, DiffModeEnum } from '@git-diff-view/react';
import { generateDiffFile } from '@git-diff-view/file';
import '@git-diff-view/react/styles/diff-view.css';
import Icon from '../Icon';
import ConfirmModal from '../ConfirmModal';
import { useAlert } from '../Alert';
import { useDiffViewMode } from '@/app/(pages)/course/[courseSlug]/DiffViewControls';
import styles from './index.module.scss';

interface DiffViewProps {
  id: string;
  number: number;
  title: string;
  status: 'NEW' | 'EDITED' | 'DELETED';
  oldCode: string;
  newCode: string;
  courseSlug: string;
  lessonSlug: string;
  isAdmin: boolean;
}

export default function DiffView({
  id,
  title,
  status,
  oldCode,
  newCode,
  courseSlug,
  lessonSlug,
  isAdmin,
}: DiffViewProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { viewMode } = useDiffViewMode();
  const [isOpen, setIsOpen] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const diffFile = generateDiffFile(
    'old.tsx',
    oldCode,
    'new.tsx',
    newCode,
    'typescript',
    'typescript'
  );

  diffFile.initTheme('light');
  diffFile.init();
  diffFile.buildSplitDiffLines();
  diffFile.buildUnifiedDiffLines();

  const statusLabels = {
    NEW: 'New',
    EDITED: 'Edited',
    DELETED: 'Deleted',
  };

  const handleEdit = () => {
    router.push(`/course/${courseSlug}/lesson/${lessonSlug}/file/${id}/edit`);
  };

  const handleDelete = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmOpen(false);

    try {
      const response = await fetch(`/api/course/${courseSlug}/lesson/${lessonSlug}/file/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        showAlert('error', result.error || 'Ошибка удаления');
        return;
      }

      showAlert('success', 'Файл удален');
      router.refresh();
    } catch {
      showAlert('error', 'Ошибка соединения с сервером');
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.header} ${isOpen ? styles.open : ''}`}>
        <div className={styles.left}>
          <span className={styles.title}>{title}</span>
          <span className={`${styles.status} ${styles[status]}`}>{statusLabels[status]}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isAdmin && (
            <div className={styles.actions} onClick={e => e.stopPropagation()}>
              <button className={styles.actionButton} onClick={handleEdit}>
                Править
              </button>
              <button className={`${styles.actionButton} ${styles.danger}`} onClick={handleDelete}>
                Удалить
              </button>
            </div>
          )}
          <span
            className={`${styles.arrow} ${isOpen ? styles.open : ''}`}
            onClick={e => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <Icon name="arrow_up" size={16} />
          </span>
        </div>
      </div>
      <div className={`${styles.body} ${isOpen ? styles.expanded : styles.collapsed}`}>
        <div className={styles.diff}>
          <GitDiffView
            diffFile={diffFile}
            diffViewMode={viewMode}
            diffViewTheme="light"
            diffViewHighlight
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Удаление файла"
        description={`Вы уверены, что хотите удалить файл "${title}"?`}
        confirmText="Удалить"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}
