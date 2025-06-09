# Soppir - E-Commerce Shoe Store

A modern, full-stack e-commerce platform built with Next.js 15, specializing in footwear retail with advanced features and seamless user experience.

🌐 **Live Demo**: [https://soppir.vercel.app/](https://soppir.vercel.app/)

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation

### Backend & Database

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage for images

### Payment & Services

- **Payments**: Stripe
- **Deployment**: Vercel
- **Image Optimization**: Next.js Image component

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Type Checking**: TypeScript strict mode

## ✨ Features

### 🛍️ Shopping Experience

- **Product Catalog**: Browse shoes by categories, brands, and filters
- **Advanced Search**: Find products with intelligent search functionality
- **Product Variants**: Multiple sizes, colors with dynamic pricing
- **Shopping Cart**: Add to cart, manage quantities, guest & user carts
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Optimized for all devices

### 🔐 Authentication & User Management

- **Multi-Provider Auth**: Google, GitHub OAuth integration
- **User Profiles**: Manage personal information and preferences
- **Order History**: Track past purchases and order status
- **Address Management**: Save multiple shipping addresses

### 💳 Payment & Checkout

- **Stripe Integration**: Secure payment processing
- **Multiple Payment Methods**: Credit cards, digital wallets
- **Order Management**: Complete checkout flow with confirmation
- **Shipping Options**: Standard, express, overnight delivery

### 👨‍💼 Admin Dashboard

- **Product Management**: Add, edit, delete products and variants
- **Order Management**: Process orders, track shipments
- **User Management**: View and manage customer accounts
- **Analytics**: Sales reports and inventory tracking

### 🎨 UI/UX

- **Modern Design**: Clean, professional interface
- **Dark/Light Mode**: Theme switching capabilities
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/soppir.git
   cd soppir
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

4. **Database Setup**

   - Import the database schema from `/database/schema.sql`
   - Set up Row Level Security policies
   - Configure authentication providers

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
soppir/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── auth/              # Authentication pages
│   ├── checkout/          # Checkout flow
│   ├── products/          # Product pages
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Auth components
│   ├── checkout/         # Checkout components
│   ├── shop/             # Shop components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── providers/            # Context providers
```

## 🔧 Configuration

### Supabase Setup

1. Create tables using the provided schema
2. Set up Row Level Security policies
3. Configure OAuth providers
4. Upload sample data

### Stripe Setup

1. Configure webhook endpoints
2. Set up product catalog
3. Configure payment methods

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for backend services
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components

---

Built with ❤️ using modern web technologies
