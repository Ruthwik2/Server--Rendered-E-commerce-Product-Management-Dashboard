# E-Commerce Product Management Dashboard

A modern, server-rendered e-commerce admin dashboard built with Next.js, featuring a dark theme UI, real-time product analytics, complete product management, and secure image handling.

## 🎯 Project Overview

This is a full-stack e-commerce product management system designed for administrators to manage products, track inventory, view analytics, and handle secure image uploads. The application uses server-side rendering (SSR) for optimal performance and SEO, with a professional dark theme interface.

**Live Demo:** [Deployed on Vercel](https://your-vercel-url.vercel.app)  
**GitHub Repository:** [View on GitHub](https://github.com/your-username/your-repo-name)

## ✨ Key Features

### Core Functionality
- **Server-Side Rendering (SSR)** - Next.js SSR for improved performance and SEO
- **Complete Product Management** - Full CRUD operations (Create, Read, Update, Delete)
- **Multi-Step Product Forms** - Intuitive 3-step form with Zod validation
  - Step 1: Basic Information (Name, Description, Category)
  - Step 2: Pricing & Inventory (Price, Stock Quantity)
  - Step 3: Product Images (Cloudinary upload or URL)
- **Real-Time Analytics Dashboard**
  - Total Products count
  - In Stock / Low Stock / Out of Stock statistics
  - **Inventory Value** - Total cost of all inventory (Price × Stock)
  - Products by Category (Pie Chart)
  - Stock Levels visualization (Bar Chart)

### Security & Authentication
- **JWT Authentication** - Secure admin login with 30-day token expiry
- **Protected Routes** - All admin pages require authentication
- **Admin-Only Access** - Only existing admins can create new admin accounts
- **Secure Image Upload** - Cloudinary integration with signed uploads

### User Interface
- **Dark Theme Design** - Professional dark mode UI
- **Responsive Layout** - Works on desktop and tablet devices
- **Case-Insensitive Categories** - Automatic category normalization
- **Real-Time Preview** - Live preview of product information during creation

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (SSR) |
| **Runtime** | Node.js 18+ |
| **Database** | MongoDB (MongoDB Atlas) |
| **ODM** | Mongoose |
| **Authentication** | JWT (jsonwebtoken) + bcryptjs |
| **Validation** | Zod |
| **Charts** | Recharts |
| **Image Storage** | Cloudinary |
| **HTTP Client** | Axios |
| **Styling** | Inline CSS (Dark Theme) |

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (for image uploads)
- **Git** installed

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-minimum-32-characters-long
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   ```

4. **Set up initial admin user**
   ```bash
   node scripts/setup-admin.js
   ```
   This creates a default admin account:
   - **Email:** `admin@dummy.com`
   - **Password:** `admin123`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### 1. Login
- Navigate to `/login`
- Enter admin credentials:
  - Email: `admin@dummy.com`
  - Password: `admin123`

### 2. Dashboard Overview
- View real-time product statistics
- See inventory value (total cost of all stock)
- Analyze category distribution
- Monitor stock levels

### 3. Product Management
- **View Products:** Click "Products" in navigation
- **Create Product:** Click "+ New Product"
  - Fill in 3-step form with validation
  - Upload image via Cloudinary or URL
- **Edit Product:** Click "Edit" button on any product
- **Delete Product:** Click "Delete" button (with confirmation)

### 4. Admin Management
- Click "Manage Admins" in navigation
- View all admin accounts
- Create new admin accounts (admin-only)
- Remove admin accounts

## 🌐 Deployment

### GitHub Repository
The project is hosted on GitHub. To update:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Vercel Deployment
The application is deployed on Vercel with automatic deployments from GitHub.

**Environment Variables on Vercel:**
Make sure to add all environment variables in Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**MongoDB Atlas Setup:**
1. Create a MongoDB Atlas cluster
2. Add your IP address to Network Access (or use `0.0.0.0/0` for testing)
3. Create a database user
4. Get connection string and add to Vercel environment variables

**Deployment URL:** [Your Vercel URL]

## 📁 Project Structure

```
ecommerce-dashboard/
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.js          # Login API endpoint
│   │   │   ├── logout.js         # Logout API endpoint
│   │   │   └── register.js       # Registration API endpoint
│   │   ├── products/
│   │   │   ├── index.js          # Get all / Create product
│   │   │   └── [id].js           # Get/Update/Delete product
│   │   ├── admin/
│   │   │   └── users/            # Admin management APIs
│   │   └── upload/
│   │       └── cloudinary.js     # Cloudinary upload signature
│   ├── products/
│   │   ├── index.js              # All products list page
│   │   ├── create.js             # Create product page
│   │   └── edit/
│   │       └── [id].js           # Edit product page
│   ├── admin/
│   │   └── manage.js             # Admin management page
│   ├── index.js                  # Dashboard (home page)
│   └── login.js                  # Login page
├── components/
│   ├── Layout.js                 # Header/Footer with navigation
│   ├── ProtectedRoute.js         # Authentication wrapper
│   ├── ProductForm.js            # Multi-step product form
│   ├── ProductList.js            # Product table component
│   ├── SalesChart.js             # Category pie chart
│   └── StockChart.js             # Stock levels bar chart
├── lib/
│   ├── db.js                     # MongoDB connection utility
│   ├── auth.js                   # JWT functions
│   └── cloudinary.js             # Cloudinary configuration
├── models/
│   ├── Product.js                # Product Mongoose schema
│   └── User.js                   # User Mongoose schema
├── middleware/
│   └── authMiddleware.js        # JWT verification middleware
├── utils/
│   └── validation.js            # Zod validation schemas
├── scripts/
│   └── setup-admin.js           # Initial admin setup script
├── styles/
│   └── globals.css              # Global dark theme styles
├── .env.local                   # Environment variables (not in git)
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

## 🎨 Features in Detail

### Dashboard Statistics
- **Total Products:** Count of all products in inventory
- **In Stock:** Products with stock ≥ 10 units
- **Low Stock:** Products with stock between 1-9 units
- **Out of Stock:** Products with stock = 0
- **Inventory Value:** Total cost of all inventory (Price × Stock for each product)

### Product Management
- **Multi-step Form:** Intuitive 3-step process
- **Real-time Validation:** Zod schema validation
- **Image Upload:** Secure Cloudinary integration
- **Case-Insensitive Categories:** Automatic normalization
- **Stock Cost Calculation:** Individual product stock cost displayed

### Data Visualization
- **Products by Category:** Interactive pie chart showing distribution
- **Stock Levels:** Bar chart displaying stock per product
- **Real-time Updates:** Charts update when products change

## 🔐 Security Features

- JWT-based authentication with 30-day expiry
- Password hashing with bcryptjs
- Protected API routes with middleware
- Secure Cloudinary uploads with signed requests
- Input validation with Zod schemas
- Admin-only access controls

## 🔧 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas Network Access settings
- Ensure database user credentials are correct

**Login Fails:**
- Run `node scripts/setup-admin.js` to create/reset admin
- Verify `JWT_SECRET` is set in environment variables

**Image Upload Fails:**
- Check Cloudinary credentials in `.env.local`
- Verify Cloudinary API key permissions

**Port 3000 Already in Use:**
```bash
lsof -ti:3000 | xargs kill -9
```

## 📝 Default Admin Credentials

For testing and evaluation purposes:
- **Email:** `admin@dummy.com`
- **Password:** `admin123`

⚠️ **Note:** Change these credentials in production environments.

## 🚀 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features

1. Create feature branch: `git checkout -b feature-name`
2. Make changes and test locally
3. Commit changes: `git commit -m "Add feature"`
4. Push to GitHub: `git push origin feature-name`
5. Create pull request on GitHub

## 📊 Project Requirements Checklist

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
| Inventory value calculation | ✅ |
| Case-insensitive categories | ✅ |

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👤 Author

**WebD PS Project**  
Next.js SSR E-commerce Dashboard

---

**Built with ❤️ using Next.js, MongoDB, and Cloudinary**
