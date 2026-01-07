# E-Commerce Product Management Dashboard

Server-rendered e-commerce admin dashboard with **dark theme** UI, real-time product analytics, and complete product management.

## 🎨 Key Features

- **Server-Side Rendering (SSR)** with Next.js for improved performance and SEO
- **Complete Product Management** - Create, Read, Update, Delete (CRUD) operations
- **Multi-step Product Forms** with Zod validation (3 steps: Basic Info → Pricing → Images)
- **Interactive Data Visualization** - Real product data charts using Recharts
  - Products by Category (Pie Chart)
  - Stock Levels (Bar Chart)
- **Secure Image Upload** with Cloudinary integration
- **JWT Authentication & Authorization** - Secure admin login with 30-day token expiry
- **Admin Onboarding** - Only existing admins can create new admin accounts (no public registration)
- **Dark Theme UI** - Professional dark mode design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

```bash
# 1. Navigate to project folder
cd ecommerce-dashboard

# 2. Install dependencies
npm install

# 3. Create .env.local file with your config:
MONGODB_URI=mongodb://localhost:27017/ecommerce-dashboard
JWT_SECRET=your-secret-key-min-32-characters
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# 4. Setup initial admin user
node scripts/setup-admin.js

# 5. Run the app
npm run dev
```

Open http://localhost:3000

### Default Admin Credentials
- **Email:** `admin@dummy.com`
- **Password:** `admin123`

## 📱 Dark Theme Features

### Color Palette
- **Background**: `#0a0e27` (Deep navy)
- **Cards**: `#1a1f3a` (Dark blue-gray)
- **Borders**: `#2d3548` (Muted gray)
- **Text**: `#e5e7eb` (Light gray)
- **Accents**: Gradient buttons with purple/indigo

### Components Styled
- ✅ Dashboard with stats cards
- ✅ Product table with status badges
- ✅ Charts with dark backgrounds
- ✅ Forms with dark inputs
- ✅ Navigation header
- ✅ Login/Register pages

## 📊 Dashboard Features

### Real-Time Stats Cards
- **Total Products** - Count of all products in inventory
- **In Stock** - Products with stock ≥ 10
- **Low Stock** - Products with stock between 1-9
- **Out of Stock** - Products with stock = 0

### Charts (Real Data)
- **Products by Category** - Pie chart showing distribution
- **Stock Levels** - Bar chart showing stock per product

## 🎯 Usage

### 1. Login as Admin
- Go to `/login`
- Use credentials: `admin@dummy.com` / `admin123`

### 2. View Dashboard
- See real product stats (Total, In Stock, Low Stock, Out of Stock)
- View category distribution pie chart
- View stock levels bar chart
- See recent products table

### 3. Manage Products
- Click "Products" to view all products
- Click "+ New Product" to create (3-step form)
  - Step 1: Basic Info (Name, Description, Category)
  - Step 2: Pricing & Stock
  - Step 3: Upload Image
- Edit/Delete from product list

### 4. Manage Admins (Admin Only)
- Click "Manage Admins" in navigation
- View existing admin accounts
- Create new admin accounts
- Remove admin accounts

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (SSR) |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | Zod |
| Charts | Recharts |
| Images | Cloudinary |
| Styling | Inline CSS (Dark Theme) |

## 📁 Project Structure

```
ecommerce-dashboard/
├── pages/
│   ├── api/
│   │   ├── auth/         # Login/Logout APIs
│   │   ├── products/     # Product CRUD APIs
│   │   ├── admin/        # Admin management APIs
│   │   └── upload/       # Cloudinary upload API
│   ├── products/
│   │   ├── index.js      # All products list
│   │   ├── create.js     # Create product page
│   │   └── edit/[id].js  # Edit product page
│   ├── admin/
│   │   └── manage.js     # Admin management page
│   ├── index.js          # Dashboard
│   └── login.js          # Login page
├── components/          
│   ├── Layout.js         # Header/Footer with navigation
│   ├── SalesChart.js     # Category pie chart
│   ├── StockChart.js     # Stock bar chart
│   ├── ProductForm.js    # Multi-step product form
│   ├── ProductList.js    # Product table component
│   └── ProtectedRoute.js # Auth wrapper
├── lib/
│   ├── db.js             # MongoDB connection
│   ├── auth.js           # JWT functions
│   └── cloudinary.js     # Cloudinary config
├── models/
│   ├── Product.js        # Product schema
│   └── User.js           # User schema
├── middleware/
│   └── authMiddleware.js # JWT verification
├── utils/
│   └── validation.js     # Zod schemas
├── scripts/
│   └── setup-admin.js    # Initial admin setup
└── styles/
    └── globals.css       # Global dark theme styles
```

## 🎨 Customization

### Change Colors

Edit `styles/globals.css`:

```css
body {
  background: #0a0e27;  /* Change background */
  color: #e5e7eb;       /* Change text color */
}
```

### Change Token Expiration

Edit `lib/auth.js`:

```javascript
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' }); // Change duration
}
```

## 🔧 Troubleshooting

**MongoDB not running:**
```bash
brew services start mongodb-community
mongosh  # Test connection
```

**Port 3000 in use:**
```bash
lsof -ti:3000 | xargs kill -9
```

**Dark theme not working:**
- Clear browser cache
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel
```

Set environment variables in Vercel dashboard.

### Other Platforms
Works on: Netlify, Render, Railway, AWS, DigitalOcean

## 📝 Project Requirements Checklist

| Requirement | Status |
|-------------|--------|
| Server-side rendering (Next.js) | ✅ |
| Complete product management (CRUD) | ✅ |
| Multi-step product creation forms | ✅ |
| Input validation (Zod) | ✅ |
| Interactive data visualization (Charts) | ✅ |
| Secure image upload (Cloudinary) | ✅ |
| Authentication & Authorization | ✅ |
| Admin-only onboarding | ✅ |

## 📞 Support

For issues:
1. Check MongoDB is running
2. Verify .env.local settings
3. Run `node scripts/setup-admin.js` to reset admin
4. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## 📄 License

MIT

---

**WebD PS Project** | Next.js SSR E-commerce Dashboard
