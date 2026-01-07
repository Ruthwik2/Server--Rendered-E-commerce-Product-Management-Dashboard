import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    window.addEventListener('authChange', checkAuth);
    return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    router.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0e27' }}>
      <header style={{
        background: '#1a1f3a',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #2d3548'
      }}>
        <h1 style={{ margin: 0, cursor: 'pointer', fontSize: '1.25rem', fontWeight: '600' }} onClick={() => router.push('/')}>
          WEBD PS · ADMIN
        </h1>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <button onClick={() => router.push('/')} style={navButtonStyle}>
                Dashboard
              </button>
              <button onClick={() => router.push('/products')} style={navButtonStyle}>
                Products
              </button>
              <button onClick={() => router.push('/products/create')} style={navButtonStyle}>
                + New Product
              </button>
              <button onClick={() => router.push('/admin/manage')} style={{ ...navButtonStyle, background: '#4f46e5', borderColor: '#4f46e5' }}>
                Manage Admins
              </button>
              <span style={{ marginLeft: '1rem', color: '#9ca3af', fontSize: '0.9rem' }}>
                {user.email}
              </span>
              <button onClick={handleLogout} style={{ ...navButtonStyle, background: '#dc2626', borderColor: '#dc2626' }}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => router.push('/login')} style={navButtonStyle}>
              Login
            </button>
          )}
        </nav>
      </header>
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>
      <footer style={{
        background: '#1a1f3a',
        padding: '1rem',
        textAlign: 'center',
        borderTop: '1px solid #2d3548',
        color: '#9ca3af',
        fontSize: '0.9rem'
      }}>
        © 2025 E-Commerce Dashboard. All rights reserved.
      </footer>
    </div>
  );
}

const navButtonStyle = {
  background: 'transparent',
  color: 'white',
  border: '1px solid #475569',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.2s',
};