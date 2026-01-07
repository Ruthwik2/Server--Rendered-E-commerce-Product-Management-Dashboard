import { useRouter } from 'next/router';
import axios from 'axios';

export default function ProductList({ products, onDelete }) {
  const router = useRouter();

  const formatCategory = (category) => {
    if (!category) return 'Uncategorized';
    const lower = category.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('token');
      console.log('Deleting product:', id, 'Token:', token ? 'exists' : 'missing');
      const response = await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Delete response:', response.data);
      onDelete();
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      alert('Failed to delete product: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Sales</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} style={trStyle}>
              <td style={tdStyle}>
                {product.images?.[0] ? (
                  <img src={product.images[0].url} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <div style={{ width: '50px', height: '50px', background: '#334155', borderRadius: '8px' }} />
                )}
              </td>
              <td style={tdStyle}>{product.name}</td>
              <td style={tdStyle}>{formatCategory(product.category)}</td>
              <td style={tdStyle}>₹{product.price.toFixed(2)}</td>
              <td style={tdStyle}>{product.stock}</td>
              <td style={tdStyle}>{product.sales || 0}</td>
              <td style={tdStyle}>
                <button onClick={() => router.push(`/products/edit/${product._id}`)} style={editButtonStyle}>
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)} style={deleteButtonStyle}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableStyle = { width: '100%', borderCollapse: 'collapse', background: '#1a1f3a', borderRadius: '12px' };
const thStyle = { padding: '1rem', textAlign: 'left', borderBottom: '2px solid #2d3548', color: '#9ca3af', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' };
const tdStyle = { padding: '1rem', borderBottom: '1px solid #2d3548', color: '#e5e7eb' };
const trStyle = { transition: 'background 0.2s' };
const editButtonStyle = { padding: '0.5rem 1rem', marginRight: '0.5rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' };
const deleteButtonStyle = { padding: '0.5rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' };