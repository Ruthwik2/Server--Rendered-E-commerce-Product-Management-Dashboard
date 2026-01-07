import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('/api/auth/login', formData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Notify Layout about auth change
      window.dispatchEvent(new Event('authChange'));

      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: '#1a1f3a', borderRadius: '12px', border: '1px solid #2d3548' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#fff' }}>Admin Login</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#9ca3af', fontSize: '0.875rem' }}>
        Sign in to access the dashboard
      </p>

      {error && <div style={{ padding: '1rem', background: '#7f1d1d', color: '#fecaca', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #991b1b' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#9ca3af', marginBottom: '0.5rem', display: 'block' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="admin@example.com"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ color: '#9ca3af', marginBottom: '0.5rem', display: 'block' }}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            style={inputStyle}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155' }}>
        <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0, textAlign: 'center' }}>
          🔒 New admins can only be added by existing administrators through the Admin Management panel.
        </p>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '0.75rem', fontSize: '16px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#e5e7eb' };
const buttonStyle = { width: '100%', padding: '0.75rem', fontSize: '16px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '1rem', fontWeight: '600' };