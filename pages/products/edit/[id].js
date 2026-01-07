import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '../../../components/ProtectedRoute';
import ProductForm from '../../../components/ProductForm';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/products');
  };

  if (loading) {
    return <ProtectedRoute><div style={{ color: '#fff' }}>Loading product...</div></ProtectedRoute>;
  }

  return (
    <ProtectedRoute>
      <div>
        <h1 style={{ color: '#fff', marginBottom: '2rem' }}>Edit Product</h1>
        {product && <ProductForm product={product} onSuccess={handleSuccess} />}
      </div>
    </ProtectedRoute>
  );
}