import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProductForm from '../../components/ProductForm';

export default function CreateProduct() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/products');
  };

  return (
    <ProtectedRoute>
      <div>
        <h1 style={{ color: '#fff', marginBottom: '2rem' }}>Create New Product</h1>
        <ProductForm onSuccess={handleSuccess} />
      </div>
    </ProtectedRoute>
  );
}