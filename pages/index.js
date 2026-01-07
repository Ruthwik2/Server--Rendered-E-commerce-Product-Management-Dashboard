import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import SalesChart from '../components/SalesChart';
import StockChart from '../components/StockChart';

const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `₹${num.toLocaleString('en-IN')}`;
};

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ 
    total: 0, 
    inStock: 0,
    lowStock: 0, 
    outOfStock: 0,
    inventoryValue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data.data);

      const total = data.data.length;
      const lowStock = data.data.filter(p => p.stock > 0 && p.stock < 10).length;
      const outOfStock = data.data.filter(p => p.stock === 0).length;
      const inStock = data.data.filter(p => p.stock >= 10).length;
      const inventoryValue = data.data.reduce(
        (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0),
        0
      );

      setStats({ 
        total, 
        inStock,
        lowStock, 
        outOfStock,
        inventoryValue
      });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProtectedRoute><div style={{ color: '#fff' }}>Loading dashboard...</div></ProtectedRoute>;
  }

  return (
    <ProtectedRoute>
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}>
            SERVER-RENDERED PRODUCT DASHBOARD
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
            Next.js SSR admin panel for complete product management, charts, and secure image handling.
          </p>
        </div>

        {/* Products Overview Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#fff' }}>PRODUCTS OVERVIEW</h2>
            <span style={{ 
              padding: '0.25rem 0.75rem',
              background: '#4f46e5',
              color: '#fff',
              fontSize: '0.75rem',
              borderRadius: '4px',
              fontWeight: '500'
            }}>
              Server-side rendered
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatCard 
              title="Total Products" 
              value={stats.total} 
              change="In inventory"
              color="#3b82f6"
            />
            <StatCard 
              title="In Stock" 
              value={stats.inStock} 
              change="Stock ≥ 10"
              color="#10b981"
            />
            <StatCard 
              title="Low Stock" 
              value={stats.lowStock} 
              change="Stock < 10"
              color="#f59e0b"
            />
            <StatCard 
              title="Out of Stock" 
              value={stats.outOfStock} 
              change="Stock = 0"
              color="#ef4444"
            />
          <StatCard 
            title="Inventory Value" 
            value={formatCurrency(stats.inventoryValue)} 
            change="Total cost of all stock"
            color="#a855f7"
          />
          </div>
        </div>

        {/* Sample Products Table */}
        <div style={{ 
          background: '#1a1f3a', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '1px solid #2d3548',
          marginBottom: '2rem'
        }}>
          <ProductTable products={products} />
        </div>

        {/* Charts Section */}
        <div style={{ marginBottom: '2rem' }}>
          <SalesChart products={products} />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <StockChart products={products} />
        </div>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ title, value, change, color }) {
  return (
    <div style={{ 
      background: '#1a1f3a', 
      padding: '1.5rem', 
      borderRadius: '12px', 
      border: '1px solid #2d3548' 
    }}>
      <h3 style={{ margin: 0, color: '#9ca3af', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '2rem', margin: '0.5rem 0', fontWeight: '700', color: '#fff' }}>
        {value}
      </p>
      <p style={{ fontSize: '0.875rem', color: color, margin: 0 }}>
        {change}
      </p>
    </div>
  );
}

function ProductTable({ products }) {
  // Add safety check for undefined products
  if (!products || products.length === 0) {
    return (
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>
          PRODUCTS
        </h2>
        <p style={{ color: '#9ca3af', padding: '2rem', textAlign: 'center' }}>
          No products yet. Click "+ New Product" to add your first product!
        </p>
      </div>
    );
  }

  const displayProducts = products.slice(0, 5); // Show first 5 products

  const formatCategory = (category) => {
    if (!category) return 'Uncategorized';
    const lower = category.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>
        PRODUCTS ({products.length} total)
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #2d3548' }}>
            <th style={thStyle}>NAME</th>
            <th style={thStyle}>SKU</th>
            <th style={thStyle}>CATEGORY</th>
            <th style={thStyle}>PRICE</th>
            <th style={thStyle}>STOCK</th>
            <th style={thStyle}>TOTAL STOCK COST</th>
          </tr>
        </thead>
        <tbody>
          {displayProducts.map((product, idx) => (
            <tr key={product._id || idx} style={{ borderBottom: '1px solid #2d3548' }}>
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name} 
                      style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '6px' }} 
                    />
                  ) : (
                    <div style={{ width: '32px', height: '32px', background: '#334155', borderRadius: '6px' }} />
                  )}
                  <span style={{ color: '#a78bfa' }}>{product.name}</span>
                </div>
              </td>
              <td style={tdStyle}>{product.description?.substring(0, 10) || 'N/A'}</td>
              <td style={tdStyle}>{formatCategory(product.category)}</td>
              <td style={tdStyle}>{formatCurrency(product.price)}</td>
              <td style={tdStyle}>{product.stock}</td>
              <td style={tdStyle}>
                {formatCurrency(
                  (Number(product.price) || 0) * (Number(product.stock) || 0)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length > 5 && (
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>
          Showing 5 of {products.length} products. <a href="/products" style={{ color: '#818cf8' }}>View all →</a>
        </p>
      )}
    </div>
  );
}

const thStyle = { 
  textAlign: 'left', 
  padding: '1rem', 
  color: '#9ca3af', 
  fontSize: '0.75rem',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tdStyle = { 
  padding: '1rem', 
  color: '#e5e7eb',
  fontSize: '0.875rem'
};

const primaryButtonStyle = { 
  padding: '0.75rem 2rem', 
  fontSize: '16px', 
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px', 
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'transform 0.2s'
};