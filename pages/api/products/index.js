import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import { authMiddleware } from '../../../middleware/authMiddleware';
import { productSchema } from '../../../utils/validation';

async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const products = await Product.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: products });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validation = productSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors[0].message });
      }

      const product = await Product.create(validation.data);
      return res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error('Product creation error:', error);
      return res.status(500).json({ error: 'Failed to create product' });
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