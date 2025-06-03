# 🌾 Harvest Quote Connect - Agricultural Products Marketplace

A comprehensive web application for agricultural product trading with advanced quotation management system, built for modern farming businesses and agricultural suppliers.

## ✨ Key Features

### 🛍️ **For Customers & Buyers:**
- **Product Catalog:** Browse extensive agricultural products with detailed specifications
- **Advanced Search:** Filter by category, origin, price range, and availability
- **Shopping Cart:** Add multiple products with quantity management
- **RFQ System:** Request custom quotes for bulk orders
- **User Dashboard:** Manage profile, orders, and quotation history
- **Secure Authentication:** Email verification and secure login

### 🏢 **For Administrators & Suppliers:**
- **Admin Dashboard:** Comprehensive management interface with analytics
- **Product Management:** Full CRUD operations for product catalog
- **RFQ Management:** Review, quote, and respond to customer requests
- **User Management:** Role-based access control and user administration
- **Analytics & Reporting:** Real-time insights and business metrics
- **Security Monitoring:** Advanced security features and audit logs

## 🛠️ Technology Stack

### **Frontend:**
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for modern, responsive styling
- **shadcn/ui** for consistent, accessible UI components
- **React Query (TanStack Query)** for efficient data management
- **React Router DOM** for client-side routing
- **Vite** for fast development and optimized builds

### **Backend & Database:**
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Auth** - Secure authentication and user management
- **Row Level Security (RLS)** - Database-level security policies
- **Real-time subscriptions** for live data updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Supabase account (for database)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/veascom-telecom-systems/harvest-quote-connect.git
cd harvest-quote-connect
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment setup:**
```bash
cp .env.example .env.local
```

4. **Configure environment variables in `.env.local`:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Start development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   ├── auth/            # Authentication components
│   ├── debug/           # Development debugging tools
│   ├── layout/          # Layout and navigation components
│   └── ui/              # Reusable UI components (shadcn/ui)
├── hooks/               # Custom React hooks
│   ├── useAuth.tsx      # Authentication hook
│   ├── useProducts.tsx  # Product management hooks
│   ├── useCart.tsx      # Shopping cart hook
│   └── useRFQ.tsx       # RFQ management hooks
├── integrations/
│   └── supabase/        # Supabase client and configuration
├── lib/                 # Utility functions and helpers
├── pages/               # Page components
│   ├── HomePage.tsx     # Landing page
│   ├── ProductsPage.tsx # Product catalog
│   ├── CartPage.tsx     # Shopping cart
│   ├── RFQPage.tsx      # Request for quotation
│   ├── ProfilePage.tsx  # User profile
│   └── AdminDashboardPage.tsx # Admin interface
└── types/               # TypeScript type definitions
```

## 🗄️ Database Schema

### Core Tables:
- **`products`** - Product catalog with pricing and specifications
- **`profiles`** - User profiles with role-based permissions
- **`rfqs`** - Request for quotation records
- **`rfq_items`** - Individual items within RFQ requests

### Security Features:
- Row Level Security (RLS) policies
- Role-based access control (Admin/User)
- Secure API endpoints
- Input validation and sanitization

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint code analysis
```

## 🎯 Core Functionality

### **Product Management:**
- ✅ Complete CRUD operations for products
- ✅ Image upload and management
- ✅ Stock tracking and availability
- ✅ Category and origin filtering
- ✅ Price management with currency support

### **RFQ (Request for Quotation) System:**
- ✅ Customer request submission
- ✅ Admin quote generation
- ✅ Status tracking (pending, quoted, accepted, rejected)
- ✅ Email notifications
- ✅ Bulk order management

### **User Authentication:**
- ✅ Secure registration and login
- ✅ Email verification
- ✅ Password reset functionality
- ✅ Role-based access control
- ✅ Session management

### **Admin Dashboard:**
- ✅ Real-time analytics and metrics
- ✅ User management interface
- ✅ Product inventory management
- ✅ RFQ processing and quoting
- ✅ Security monitoring and logs

## 📱 Responsive Design

Fully optimized for all devices:
- 📱 **Mobile:** 375px and up
- 📱 **Tablet:** 768px and up
- 💻 **Desktop:** 1024px and up
- 🖥️ **Large screens:** 1440px and up

## 🚀 Deployment

### **Vercel (Recommended):**
1. Connect GitHub repository to Vercel
2. Configure environment variables
3. Automatic deployments on push to main branch

### **Netlify:**
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Configure environment variables

### **Manual Deployment:**
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## 🔒 Security Features

- **Multi-layer Security:** Route, UI, Database, and API level protection
- **Row Level Security:** Database policies for data isolation
- **Input Validation:** Comprehensive form and API validation
- **Authentication:** Secure JWT-based authentication
- **Authorization:** Role-based access control
- **HTTPS:** Encrypted data transmission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Email:** veascom.telecom.systems@gmail.com
- **GitHub Issues:** [Create an issue](https://github.com/veascom-telecom-systems/harvest-quote-connect/issues)
- **Documentation:** [Wiki](https://github.com/veascom-telecom-systems/harvest-quote-connect/wiki)

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Supabase** for the backend infrastructure
- **Tailwind CSS** for the utility-first CSS framework
- **shadcn/ui** for beautiful, accessible components
- **Vercel** for seamless deployment platform

---

**Built with ❤️ for the agricultural community**

*Empowering farmers, suppliers, and agricultural businesses with modern technology solutions.*
