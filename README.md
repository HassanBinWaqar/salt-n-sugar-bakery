# 🧁 Salt N Sugar - Premium Bakery E-Commerce Website

A modern, full-stack e-commerce website for a premium bakery built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS. Features a beautiful customer-facing storefront and a comprehensive admin dashboard for complete business management.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Local-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## ✨ Features

### 🛍️ Customer Features
- **Beautiful Product Showcase** - Responsive product cards with image galleries and ratings
- **Shopping Cart** - Persistent cart with localStorage, quantity management, and size selection
- **Product Categories** - Filter by Birthday Cakes, Wedding Cakes, Cupcakes, Pastries, etc.
- **Customer Reviews** - Submit reviews with ratings (requires admin approval)
- **WhatsApp Ordering** - Direct order placement via WhatsApp with pre-formatted messages
- **Hero Carousel** - Dynamic image slider for promotions
- **Responsive Design** - Mobile-first design with smooth animations

### 🔐 Admin Dashboard Features

#### 📊 Dashboard Overview
- Real-time statistics (products, hero photos, reviews, average rating)
- Quick actions for common tasks
- Latest reviews preview
- Website status indicators
- Image storage monitoring with size warnings

#### 🎂 Product Management
- Add/Edit/Delete products with multiple images
- Image gallery support (up to 8 images per product)
- Stock management (in stock toggle + quantity tracking)
- Active/Inactive product status
- Size and price variations
- Search and filter by name/category
- Bulk delete operations
- Image size validation (200KB ideal, 500KB warning, 1MB limit)
- Quick edit functionality

#### 🖼️ Hero Photos Management
- Upload hero images for homepage carousel
- Active/Inactive toggle (hide without deleting)
- Display order management
- Image preview with size display

#### ⭐ Review Management
- Approve/Reject customer reviews
- Filter by status (All, Approved, Pending)
- Delete reviews
- Review moderation system

#### 📦 Order Management
- Manual order entry from WhatsApp
- Order status workflow (Pending → Preparing → Out for Delivery → Completed)
- Multiple items per order
- Customer details tracking
- Payment method selection
- Delivery date scheduling
- Filter orders by date and status
- Auto-generated order numbers (SNS-YYYYMMDD-001)

#### 👥 Customer Database
- View all registered users
- Search by name or email
- Export customer data to CSV
- Customer management
- Join date tracking

#### 📱 WhatsApp Analytics
- Track most ordered products
- Revenue tracking with date ranges (Today, Week, Month, All Time)
- Average order value calculations
- Payment method breakdown
- Order status distribution
- 7-day revenue trend visualization
- Product popularity metrics

#### ⚙️ Settings
- Change admin password securely
- Security tips and guidelines
- Account information display

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Custom animations
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Local)
- **ODM**: Mongoose
- **Authentication**: JWT tokens, bcrypt password hashing
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Image Handling**: Base64 encoding with size validation

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- MongoDB (running locally on port 27017)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/salt-n-sugar-bakery.git
cd salt-n-sugar-bakery
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/saltnsugar
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_WHATSAPP_NUMBER=923335981875
```

4. **Start MongoDB**

Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongodb
```

5. **Create admin user**

Run the admin creation script:
```bash
node scripts/createAdmin.js
```

Default admin credentials:
- Username: `admin`
- Password: `admin123`

⚠️ **Important**: Change the default password after first login!

6. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
salt-n-sugar-bakery/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/     # Admin dashboard
│   │   │   └── login/         # Admin login
│   │   ├── api/
│   │   │   ├── admin/         # Admin API routes
│   │   │   │   ├── analytics/
│   │   │   │   ├── change-password/
│   │   │   │   ├── hero-photos/
│   │   │   │   ├── login/
│   │   │   │   ├── orders/
│   │   │   │   ├── products/
│   │   │   │   ├── reviews/
│   │   │   │   └── users/
│   │   │   ├── auth/          # User authentication
│   │   │   └── reviews/       # Public reviews API
│   │   ├── cart/              # Shopping cart page
│   │   ├── reviews/           # Review submission page
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable React components
│   │   ├── FavoriteCakes.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   └── Testimonials.tsx
│   ├── context/
│   │   ├── AuthContext.tsx    # User authentication context
│   │   └── CartContext.tsx    # Shopping cart context
│   ├── lib/
│   │   └── mongodb.ts         # MongoDB connection
│   └── models/                # Mongoose schemas
│       ├── Admin.ts
│       ├── HeroPhoto.ts
│       ├── Order.ts
│       ├── Product.ts
│       ├── Review.ts
│       └── User.ts
├── scripts/
│   ├── createAdmin.js         # Create admin user
│   └── resetAdmin.js          # Reset admin password
└── public/                    # Static assets
```

## 🎨 Color Scheme

- Primary (Coral): `#FF6B6B`
- Secondary (Mint): `#C0E6E4`
- Accent (Pink): `#FFB4C5`
- Background (Cream): `#FFF8F0`

## 🔐 Admin Access

**URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Default Credentials**:
- Username: `admin`
- Password: `admin123`

**Features Available**:
- Dashboard Overview
- Hero Photos Management
- Product Management (CRUD operations)
- Review Moderation
- Order Management
- Customer Database
- WhatsApp Analytics
- Settings (Change Password)

## 📱 WhatsApp Integration

Orders are placed via WhatsApp with pre-formatted messages including:
- Customer name and contact details
- Selected products with sizes and quantities
- Delivery address
- Total amount

## 🗄️ Database Models

### Product
- Product ID, name, description
- Category, rating, reviews count
- Multiple sizes with prices
- Image gallery (main + additional images)
- Stock management (in stock, quantity)
- Active/Inactive status
- Ingredients list

### Order
- Auto-generated order number
- Customer details (name, phone, email, address)
- Items array (product, size, quantity, price)
- Total amount
- Payment method
- Status (Pending, Preparing, Out for Delivery, Completed, Cancelled)
- Delivery date, notes

### Review
- Customer name, email, profile image
- Rating (1-5 stars)
- Review text
- Approved status (requires admin approval)
- Gender (for avatar selection)

### HeroPhoto
- Image URL (base64)
- Title
- Display order
- Active/Inactive status

### User
- Name, email
- Hashed password
- Registration date

### Admin
- Username, email
- Hashed password
- Creation date

## 🛡️ Security Features

- JWT-based authentication with 7-day expiry
- Password hashing with bcrypt (10 rounds)
- Admin route protection via middleware
- Token verification on all admin API routes
- Secure password change functionality
- Input validation and sanitization

## 📊 Analytics & Insights

The admin dashboard provides comprehensive business analytics:
- Revenue tracking by time period
- Product popularity rankings
- Order status distribution
- Payment method analysis
- Customer growth tracking
- 7-day revenue trends

## 🎯 Future Enhancements

- [ ] Online payment integration (Stripe/PayPal)
- [ ] Email notifications for orders
- [ ] SMS notifications
- [ ] Advanced inventory management
- [ ] Discount codes and promotions
- [ ] Customer loyalty program
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Automated review reminders
- [ ] Sales reports export (PDF/Excel)

## 🐛 Known Issues

- Image uploads limited to 1MB (by design for performance)
- WhatsApp ordering requires manual confirmation
- Review approval required for public display

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Website: [yourwebsite.com](https://yourwebsite.com)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first CSS framework
- All contributors who helped improve this project

## 📞 Support

For support, email your-email@example.com or open an issue in the GitHub repository.

---

**Made with ❤️ and ☕ for Salt N Sugar Bakery**
