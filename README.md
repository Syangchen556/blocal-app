# Vegetable Store

A Next.js-based online store for fresh vegetables and fruits with role-based authentication.

## Features

- Role-based authentication (Admin, Seller, Buyer)
- Beautiful and responsive UI
- Product catalog with categories
- Shopping cart functionality
- User dashboards based on roles

## Demo Accounts

```
Admin:
- Email: admin@example.com
- Password: admin123

Seller:
- Email: seller@example.com
- Password: seller123

Buyer:
- Email: buyer@example.com
- Password: buyer123
```

## Prerequisites

- Node.js 18.x or later
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd vegetable-store
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # Dashboard pages
│   │   └── page.jsx        # Homepage
│   ├── components/         # React components
│   │   ├── home/          # Homepage components
│   │   ├── layout/        # Layout components
│   │   └── products/      # Product-related components
│   └── styles/            # Global styles
├── public/                # Static files
└── package.json          # Project dependencies
```

## Role-Based Features

### Admin
- User management
- Analytics dashboard
- Product approval
- Category management

### Seller
- Product management
- Order management
- Sales analytics
- Inventory management

### Buyer
- Browse products
- Shopping cart
- Order history
- Favorites list

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
