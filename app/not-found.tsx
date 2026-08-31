import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '5px' }}>404</h1>
      <p style={{ fontSize: '13px', marginBottom: '10px' }}>Page not found</p>
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
