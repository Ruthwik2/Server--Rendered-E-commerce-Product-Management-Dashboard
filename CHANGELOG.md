# Changelog

## Version 2.0 - Dark Theme Edition (December 29, 2025)

### 🎨 New Features
- **Dark Theme UI** - Complete dark mode redesign
- **Random Sales Data Generator** - Automatic chart data generation
- **Enhanced Dashboard Layout** - Product preview table and form preview
- **Improved Visual Design** - Gradient buttons, status badges, better spacing

### 🔄 Updated Components

#### Pages
- `pages/index.js` - New dashboard layout with dark theme
- `pages/login.js` - Dark styled authentication page
- `pages/products/index.js` - Dark product list page
- `pages/products/create.js` - Dark product creation page
- `pages/products/edit/[id].js` - Dark edit page

#### Components
- `components/Layout.js` - Dark header and footer
- `components/SalesChart.js` - **NEW** Random data generation
- `components/StockChart.js` - Dark theme styling
- `components/ProductForm.js` - Dark form inputs
- `components/ProductList.js` - Dark table design
- `components/ProtectedRoute.js` - Dark loading state

#### Styles
- `styles/globals.css` - Complete dark theme CSS

### 🎨 Color Scheme
- Background: `#0a0e27`
- Cards: `#1a1f3a`
- Borders: `#2d3548`
- Text: `#e5e7eb`
- Accents: Purple/Indigo gradients

### 📊 Data Generation
- Monthly sales: Random 50-200 units
- Revenue: Random ₹10,000-60,000
- Auto-regenerates on component mount

---

## Version 1.0 - Initial Release

### Features
- Next.js SSR setup
- MongoDB integration
- JWT authentication
- Product CRUD operations
- Cloudinary image uploads
- Recharts data visualization
- Zod validation
