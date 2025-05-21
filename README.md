# Blocal - Local Marketplace Platform

A Next.js-based marketplace platform for local businesses with role-based authentication and comprehensive shop management.

## Features

- Role-based authentication (Admin, Seller, Buyer)
- Comprehensive shop management system
- Product catalog with categories and variants
- Shopping cart and wishlist functionality
- User dashboards based on roles
- Shop verification and approval system
- Rating and review system
- Order management
- Analytics and statistics

## Demo Accounts

```
Admin:
- Email: admin@blocal.bt
- Password: admin123

Seller:
- Email: seller1@blocal.bt
- Password: seller123

Buyer:
- Email: buyer@blocal.bt
- Password: buyer123
```

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB 6.0 or later

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd blocal-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Seed the database:
```bash
npm run seed
# or
yarn seed
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   │   ├── shops/     # Shop management endpoints
│   │   │   ├── products/  # Product management endpoints
│   │   │   └── auth/      # Authentication endpoints
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   └── page.jsx       # Homepage
│   ├── components/        # React components
│   │   ├── home/         # Homepage components
│   │   ├── layout/       # Layout components
│   │   ├── products/     # Product-related components
│   │   └── shops/        # Shop-related components
│   ├── models/           # MongoDB models
│   ├── utils/            # Utility functions
│   └── styles/           # Global styles
├── public/               # Static files
└── package.json         # Project dependencies
```

## Role-Based Features

### Admin
- User management
- Shop verification and approval
- Analytics dashboard
- Product approval
- Category management
- System configuration

### Seller
- Shop management
  - Create and edit shop profile
  - Upload shop media
  - View shop statistics
  - Manage shop status
- Product management
  - Add/edit/delete products
  - Manage inventory
  - Set pricing and variants
- Order management
- Sales analytics
- Customer feedback

### Buyer
- Browse shops and products
- Shopping cart
- Wishlist
- Order history
- Reviews and ratings
- Shop following

## API Documentation

### Shop Management

#### GET /api/shops
- Get all shops (filtered by user role)
- Admin: All shops
- Seller: Their shop
- Buyer: Approved and active shops

#### POST /api/shops
- Create a new shop (Seller only)
- Required fields: name, description, address
- Optional fields: media, logo, coverImage

#### DELETE /api/shops
- Delete a shop (Shop owner only)
- Soft delete implementation

### Blog Management

#### GET /api/blogs
- Get all published blogs with pagination and filtering
- Query parameters:
  - `category`: Filter by category (RECIPES, FARMING, NUTRITION, SUSTAINABILITY, OTHER)
  - `tag`: Filter by tag
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `sort`: Sort order (latest, popular, mostLiked)
- Returns: List of blogs with pagination info

#### POST /api/blogs
- Create a new blog (Authenticated users only)
- Required fields:
  ```json
  {
    "title": "Blog Title",
    "content": "Blog content (min 100 characters)",
    "category": "RECIPES", // One of: RECIPES, FARMING, NUTRITION, SUSTAINABILITY, OTHER
    "media": {
      "featuredImage": "URL to featured image"
    }
  }
  ```
- Optional fields:
  ```json
  {
    "summary": "Brief summary",
    "tags": ["tag1", "tag2"],
    "media": {
      "gallery": ["URL1", "URL2"]
    },
    "status": "DRAFT", // or "PUBLISHED"
    "seo": {
      "metaTitle": "SEO title",
      "metaDescription": "SEO description",
      "keywords": ["keyword1", "keyword2"]
    }
  }
  ```

#### GET /api/blogs/[blogId]
- Get a single blog by ID
- Returns: Full blog details with author and comments

#### POST /api/blogs/[blogId]/comments
- Add a comment to a blog
- Required fields:
  ```json
  {
    "content": "Comment text"
  }
  ```

#### POST /api/blogs/[blogId]/likes
- Toggle like on a blog
- Returns: Updated like count and user's like status

### Post Management

#### GET /api/posts
- Get all posts with pagination
- Returns: List of posts with author and comment details

#### POST /api/posts
- Create a new post (Authenticated users only)
- Required fields:
  ```json
  {
    "title": "Post Title",
    "content": "Post content",
    "excerpt": "Brief excerpt",
    "imageUrl": "URL to post image"
  }
  ```

#### GET /api/posts/[postId]/comments
- Get all comments for a post
- Returns: List of comments with author details

#### POST /api/posts/[postId]/comments
- Add a comment to a post
- Required fields:
  ```json
  {
    "text": "Comment text"
  }
  ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


