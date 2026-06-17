'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', background: '#f5f5f7' }}>
        <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1d1d1f', marginBottom: '12px' }}>Something went wrong!</h2>
          <p style={{ fontSize: '14px', color: '#86868b', marginBottom: '24px', lineHeight: 1.5 }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: 600,
              background: '#007AFF',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
