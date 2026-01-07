import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function ManageAdmins() {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(data.data);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/users', {
        email: formData.email,
        password: formData.password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Admin created successfully!');
      setFormData({ email: '', password: '', confirmPassword: '' });
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdmins();
    } catch (error) {
      alert('Failed to delete admin');
    }
  };

  if (loading) {
    return <ProtectedRoute><div style={{ color: '#fff' }}>Loading...</div></ProtectedRoute>;
  }

  return (
    <ProtectedRoute>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ color: '#fff', marginBottom: '0.5rem' }}>Admin Management</h1>
            <p style={{ color: '#9ca3af', margin: 0 }}>Manage admin users who can access this dashboard</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '0.75rem 1.5rem',
              background: showForm ? '#334155' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            {showForm ? 'Cancel' : '+ Add New Admin'}
          </button>
        </div>

        {error && (
          <div style={{ padding: '1rem', background: '#7f1d1d', color: '#fecaca', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #991b1b' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '1rem', background: '#14532d', color: '#86efac', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #166534' }}>
            {success}
          </div>
        )}

        {showForm && (
          <div style={{
            background: '#1a1f3a',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #2d3548',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create New Admin</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem' }}>Email *</label>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem' }}>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    style={inputStyle}
                    placeholder="Min 6 characters"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', color: '#9ca3af', marginBottom: '0.5rem' }}>Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '0.75rem 2rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {submitting ? 'Creating...' : 'Create Admin'}
              </button>
            </form>
          </div>
        )}

        <div style={{
          background: '#1a1f3a',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #2d3548'
        }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.25rem' }}>
            Current Admins ({admins.length})
          </h2>
          
          {admins.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>No admins found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d3548' }}>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id} style={{ borderBottom: '1px solid #2d3548' }}>
                    <td style={tdStyle}>{admin.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: '#6366f120',
                        color: '#a78bfa',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {admin.role}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#dc2626',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  fontSize: '16px',
  borderRadius: '8px',
  border: '1px solid #334155',
  background: '#1e293b',
  color: '#e5e7eb'
};

const thStyle = {
  padding: '1rem',
  textAlign: 'left',
  color: '#9ca3af',
  fontWeight: '600',
  fontSize: '0.75rem',
  textTransform: 'uppercase'
};

const tdStyle = {
  padding: '1rem',
  color: '#e5e7eb'
};
