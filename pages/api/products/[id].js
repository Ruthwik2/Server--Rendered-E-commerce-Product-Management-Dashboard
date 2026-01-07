import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { productSchema } from '../../../utils/validation';

async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const validation = productSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors[0].message });
      }

      const product = await Product.findByIdAndUpdate(
        id,
        { ...validation.data, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({ success: true, data: product });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update product' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default function protectedHandler(req, res) {
  if (req.method === 'GET') {
    return handler(req, res);
  }
  return authMiddleware(handler)(req, res);
}