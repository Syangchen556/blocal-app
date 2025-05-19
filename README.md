# BLocal - Local Marketplace

A Next.js-based online marketplace for local products with role-based authentication and MongoDB Atlas integration.

## Features

- Role-based authentication (Admin, Seller, Buyer)
- MongoDB Atlas integration for cloud database
- Beautiful and responsive UI with Tailwind CSS
- Product catalog with categories and search
- Shopping cart with animations
- Wishlist functionality
- Blog system with user-generated content
- Shop profiles and analytics
- Real-time product reviews and ratings
- Bhutanese Ngultrum (Nu.) currency support

## Tech Stack

- Next.js 14
- MongoDB Atlas
- NextAuth.js for authentication
- Tailwind CSS for styling
- React Icons
- React Hot Toast for notifications

## Prerequisites

- Node.js 18.x or later
- MongoDB Atlas account
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd blocal-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── blog/           # Blog pages
│   │   ├── cart/           # Shopping cart
│   │   ├── dashboard/      # User dashboards
│   │   ├── products/       # Product pages
│   │   ├── shops/          # Shop pages
│   │   └── wishlist/       # Wishlist pages
│   ├── components/         # React components
│   │   ├── ui/            # UI components
│   │   ├── products/      # Product components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utility functions
│   └── models/            # MongoDB models
├── public/                # Static files
└── package.json          # Project dependencies
```

## Features by Role

### Admin
- User and shop management
- Product approval system
- Analytics dashboard
- Blog moderation

### Seller
- Shop profile management
- Product management (CRUD)
- Sales analytics
- Shop statistics
- Blog creation

### Buyer
- Browse and search products
- Shopping cart with animations
- Wishlist management
- Product reviews
- Blog creation and interaction
- Shop browsing

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/shops/*` - Shop management
- `/api/cart/*` - Shopping cart operations
- `/api/wishlist/*` - Wishlist operations
- `/api/blogs/*` - Blog management
- `/api/upload/*` - File upload handling

## Models

- User - User information and authentication
- Shop - Shop profiles and management
- Product - Product listings and details
- Blog - Blog posts and interactions
- Cart - Shopping cart data
- Wishlist - User wishlist items

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
