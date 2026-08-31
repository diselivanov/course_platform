'use client';

import Link from 'next/link';

export default function Error() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '5px' }}>500</h1>
      <p style={{ fontSize: '13px', marginBottom: '10px' }}>Something went wrong</p>
      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '8px 20px',
          background: 'hsl(210, 100%, 45%)',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '13px',
        }}
      >
        На главную
      </Link>
    </div>
  );
}
