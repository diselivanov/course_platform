'use client';

import { useState } from 'react';
import styles from './index.module.scss';

interface VideoPlayerProps {
  youtubeUrl?: string | null;
  vkUrl?: string | null;
}

type Tab = 'youtube' | 'vk';

export default function VideoPlayer({ youtubeUrl, vkUrl }: VideoPlayerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('youtube');

  const hasYoutube = youtubeUrl && youtubeUrl.trim().length > 0;
  const hasVk = vkUrl && vkUrl.trim().length > 0;

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  const getVkEmbedUrl = (url: string) => {
    const match = url.match(/vk\.com\/video-?\d+_\d+/);
    return match
      ? `https://vk.com/video_ext.php?oid=${match[0].replace('vk.com/video', '').split('_')[0]}&id=${match[0].split('_')[1]}&hash=0`
      : url;
  };

  const getVideoUrl = () => {
    if (activeTab === 'youtube' && hasYoutube) {
      return getYoutubeEmbedUrl(youtubeUrl!);
    }
    if (activeTab === 'vk' && hasVk) {
      return getVkEmbedUrl(vkUrl!);
    }
    return null;
  };

  const videoUrl = getVideoUrl();
  const hasVideo = videoUrl !== null;

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'youtube' ? styles.active : ''}`}
          onClick={() => setActiveTab('youtube')}
        >
          YouTube
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'vk' ? styles.active : ''}`}
          onClick={() => setActiveTab('vk')}
        >
          VK Видео
        </button>
      </div>
      <div className={styles.videoWrapper}>
        {hasVideo ? (
          <iframe
            src={videoUrl}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div>Видео не добавлено</div>
        )}
      </div>
    </div>
  );
}
