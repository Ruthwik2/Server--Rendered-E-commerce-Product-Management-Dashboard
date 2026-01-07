import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().int().min(0, 'Stock must be positive'),
  category: z.string().min(1, 'Category is required'),
  images: z.array(z.object({
    url: z.string(),
    // publicId is only present for uploaded images from Cloudinary.
    // When adding an image via URL, we omit publicId, so it must be optional.
    publicId: z.string().optional(),
  })).optional().default([]),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});