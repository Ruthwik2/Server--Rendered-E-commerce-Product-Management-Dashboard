import { useState } from 'react';
import axios from 'axios';

export default function ProductForm({ product, onSuccess }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || '',
    category: product?.category || '',
  });
  const [images, setImages] = useState(product?.images || []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const totalSteps = 3;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For numeric fields, allow the input to be temporarily empty so the
    // user can clear the "0" and type freely, instead of it snapping back.
    if (name === 'price' || name === 'stock') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseFloat(value)
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const { data: signatureData } = await axios.get('/api/upload/cloudinary', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const uploadedImages = [];

      for (const file of files) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('timestamp', signatureData.timestamp);
        uploadFormData.append('signature', signatureData.signature);
        uploadFormData.append('api_key', signatureData.apiKey);
        uploadFormData.append('folder', 'products');

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          uploadFormData
        );

        uploadedImages.push({
          url: response.data.secure_url,
          publicId: response.data.public_id,
        });
      }

      setImages(uploadedImages.slice(0, 1));
    } catch (err) {
      setError('Failed to upload images');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    const url = imageUrl.trim();

    if (!url) {
      setError('Please enter an image URL');
      return;
    }

    try {
      // Basic URL validation
      const parsed = new URL(url);
      if (!/^https?:$/.test(parsed.protocol)) {
        setError('Please enter a valid http or https URL');
        return;
      }
    } catch {
      setError('Please enter a valid image URL');
      return;
    }

    setError('');

    // Limit to a single image (same as file upload behaviour).
    // Do not send a null publicId to the backend – just omit it.
    setImages([{ url }]);
    setImageUrl('');
  };

  const validateStep = (currentStep) => {
    setError('');
    
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setError('Product name is required');
        return false;
      }
      if (!formData.description.trim()) {
        setError('Description is required');
        return false;
      }
      if (!formData.category.trim()) {
        setError('Category is required');
        return false;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.price || formData.price <= 0) {
        setError('Valid price is required');
        return false;
      }
      if (formData.stock === '' || formData.stock === undefined || formData.stock < 0) {
        setError('Valid stock quantity is required');
        return false;
      }
    }
    
    return true;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const productData = { ...formData, images };

      if (product) {
        await axios.put(`/api/products/${product._id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: step >= s ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease'
            }}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && (
              <div style={{
                flex: 1,
                height: '3px',
                background: step > s ? '#6366f1' : '#334155',
                margin: '0 0.5rem',
                transition: 'all 0.3s ease'
              }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: step >= 1 ? '#a78bfa' : '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Basic Info</span>
        <span style={{ color: step >= 2 ? '#a78bfa' : '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Pricing & Stock</span>
        <span style={{ color: step >= 3 ? '#a78bfa' : '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>Images</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <>
      <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Step 1: Basic Information</h3>
      
      <div style={fieldStyle}>
        <label style={labelStyle}>Product Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows="4"
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Category *</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="e.g., Electronics, Clothing, etc."
          style={inputStyle}
        />
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Step 2: Pricing & Inventory</h3>
      
      <div style={fieldStyle}>
        <label style={labelStyle}>Price (₹) *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Stock Quantity *</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="0"
          min="0"
          style={inputStyle}
        />
      </div>

      <div style={{ 
        padding: '1rem', 
        background: '#0f172a', 
        borderRadius: '8px', 
        marginTop: '1rem',
        border: '1px solid #334155'
      }}>
        <h4 style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Preview</h4>
        <p style={{ color: '#fff', margin: 0 }}>
          <strong>{formData.name || 'Product Name'}</strong> - ₹{formData.price || 0} ({formData.stock || 0} in stock)
        </p>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Step 3: Product Images</h3>
      
      <div style={fieldStyle}>
        <label style={labelStyle}>Upload Image</label>
        <div style={{
          border: '2px dashed #334155',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          background: '#0f172a',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
            <div style={{ color: '#6366f1', fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
            <p style={{ color: '#9ca3af', margin: 0 }}>
              {uploading ? 'Uploading...' : 'Click to upload product image'}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>
              PNG, JPG, GIF up to 10MB
            </p>
          </label>
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Or add image via URL</label>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            style={{
              padding: '0.75rem 1.25rem',
              fontSize: '0.875rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              whiteSpace: 'nowrap'
            }}
          >
            Add Image
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div style={fieldStyle}>
          <label style={labelStyle}>Product Image</label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {images.slice(0, 1).map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img 
                  src={img.url} 
                  alt="Product" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'cover', 
                    borderRadius: '8px', 
                    border: '2px solid #334155' 
                  }} 
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ 
        padding: '1rem', 
        background: '#0f172a', 
        borderRadius: '8px', 
        marginTop: '1rem',
        border: '1px solid #334155'
      }}>
        <h4 style={{ color: '#9ca3af', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Summary</h4>
        <div style={{ color: '#fff', fontSize: '0.875rem' }}>
          <p style={{ margin: '0.25rem 0' }}><strong>Name:</strong> {formData.name}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Category:</strong> {formData.category}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Price:</strong> ₹{formData.price}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Stock:</strong> {formData.stock}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Images:</strong> {images.length} uploaded</p>
        </div>
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {renderStepIndicator()}
      
      {error && <div style={errorStyle}>{error}</div>}

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        {step > 1 && (
          <button
            type="button"
            onClick={(e) => prevStep(e)}
            style={secondaryButtonStyle}
          >
            ← Previous
          </button>
        )}
        
        {step < totalSteps ? (
          <button
            type="button"
            onClick={(e) => nextStep(e)}
            style={{ ...buttonStyle, marginLeft: step === 1 ? 'auto' : 0 }}
          >
            Next →
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || uploading}
            style={buttonStyle}
          >
            {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
          </button>
        )}
      </div>
    </form>
  );
}

const formStyle = { maxWidth: '600px', margin: '0 auto' };
const fieldStyle = { marginBottom: '1.5rem' };
const labelStyle = { display: 'block', color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' };
const inputStyle = { width: '100%', padding: '0.75rem', fontSize: '16px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#e5e7eb' };
const buttonStyle = { flex: 1, padding: '0.75rem 1.5rem', fontSize: '16px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };
const secondaryButtonStyle = { flex: 1, padding: '0.75rem 1.5rem', fontSize: '16px', background: 'transparent', color: '#9ca3af', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' };
const errorStyle = { padding: '1rem', background: '#7f1d1d', color: '#fecaca', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #991b1b' };