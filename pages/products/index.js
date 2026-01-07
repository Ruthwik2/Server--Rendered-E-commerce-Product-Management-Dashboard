import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProductList from '../../components/ProductList';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProtectedRoute><div style={{ color: '#fff' }}>Loading products...</div></ProtectedRoute>;
  }

  return (
    <ProtectedRoute>
      <div>
        <h1 style={{ color: '#fff', marginBottom: '2rem' }}>All Products</h1>
        {products.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>No products found. Create your first product!</p>
        ) : (
          <ProductList products={products} onDelete={fetchProducts} />
        )}
      </div>
    </ProtectedRoute>
  );
}