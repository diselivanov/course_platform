'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '../Icon';
import styles from './index.module.scss';

interface SearchResult {
  id: string;
  number: number;
  title: string;
  slug: string;
  description: string | null;
  course: {
    title: string;
    slug: string;
  };
}

function highlightText(text: string, query: string) {
  if (!query || !text) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  return (
    <>
      {before}
      <span className={styles.highlight}>{match}</span>
      {after}
    </>
  );
}

function getHighlightedSnippet(text: string, query: string, maxLength: number) {
  if (!query || !text) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
  }

  const queryLen = query.length;
  const half = Math.floor((maxLength - queryLen) / 2);

  let start = index - half;
  let end = index + queryLen + half;

  if (start < 0) {
    end = Math.min(end - start, text.length);
    start = 0;
  }

  if (end > text.length) {
    start = Math.max(0, start - (end - text.length));
    end = text.length;
  }

  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';

  const displayText = text.slice(start, end);
  const matchIndex = displayText.toLowerCase().indexOf(lowerQuery);

  if (matchIndex === -1) {
    return prefix + displayText + suffix;
  }

  return (
    <>
      {prefix}
      {displayText.slice(0, matchIndex)}
      <span className={styles.highlight}>
        {displayText.slice(matchIndex, matchIndex + queryLen)}
      </span>
      {displayText.slice(matchIndex + queryLen)}
      {suffix}
    </>
  );
}

export default function Search() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [debouncedQuery] = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!debouncedQuery || debouncedQuery.trim().length === 0) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const result = await response.json();
        if (result.success) {
          setResults(result.data);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      }
    };

    fetchResults();
  }, [debouncedQuery, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const handleResultClick = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const hasQuery = debouncedQuery && debouncedQuery.trim().length > 0;

  return (
    <>
      <button className={styles.searchButton} onClick={() => setIsOpen(true)}>
        <Icon name="search" size={14} />
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={styles.modal}>
            <div
              className={`${styles.inputWrapper} ${hasQuery ? styles.inputWrapperWithResults : ''}`}
            >
              <span className={styles.inputIcon}>
                <Icon name="search" size={16} />
              </span>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Поиск по урокам"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className={`${styles.results} ${hasQuery ? styles.resultsVisible : ''}`}>
              {hasQuery && results.length === 0 && (
                <div className={styles.empty}>По вашему запросу ничего не найдено</div>
              )}
              {results.map(result => (
                <Link
                  key={result.id}
                  href={`/course/${result.course.slug}?lesson=${result.slug}`}
                  className={styles.resultItem}
                  onClick={() =>
                    handleResultClick(`/course/${result.course.slug}?lesson=${result.slug}`)
                  }
                >
                  <span className={styles.resultCourse}>Курс: {result.course.title}</span>
                  <span className={styles.resultTitle}>
                    {getHighlightedSnippet(` ${result.title}`, debouncedQuery, 60)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
