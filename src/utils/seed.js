import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Blog from '../models/Blog.js';
import connectDB from '../lib/mongodb.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting the seed script...");

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blocal';

<<<<<<< HEAD
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined. Check your .env file.");
  process.exit(1);
}
=======
async function createTestAccounts() {
  // Create admin account
  const adminPassword = await hash('admin123', 12);
  const admin = await User.findOneAndUpdate(
    { email: 'admin@blocal.bt' },
    {
      name: 'Admin User',
      email: 'admin@blocal.bt',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
      status: 'active',
      profile: {
        phoneNumber: '17111111',
        address: {
          street: 'Norzin Lam',
          city: 'Thimphu',
          state: 'Thimphu',
          zipCode: '11001',
          country: 'Bhutan'
        }
      }
    },
    { upsert: true, new: true }
  );
  console.log('✅ Admin account created:', admin.email);

  // Create seller account
  const sellerPassword = await hash('seller123', 12);
  const seller = await User.findOneAndUpdate(
    { email: 'seller@blocal.bt' },
    {
      name: 'Test Seller',
      email: 'seller@blocal.bt',
      password: sellerPassword,
      role: 'SELLER',
      emailVerified: true,
      status: 'active',
      profile: {
        phoneNumber: '17222222',
        address: {
          street: 'Chang Lam',
          city: 'Thimphu',
          state: 'Thimphu',
          zipCode: '11001',
          country: 'Bhutan'
        }
      }
    },
    { upsert: true, new: true }
  );
  console.log('✅ Seller account created:', seller.email);

  // Create shop for seller
  const sellerShop = await Shop.findOneAndUpdate(
    { owner: seller._id },
    {
      name: 'Test Shop',
      description: 'A test shop for development purposes',
      owner: seller._id,
      location: 'Thimphu',
      contact: {
        phone: '17222222',
        email: 'seller@blocal.bt'
      },
      status: 'active'
    },
    { upsert: true, new: true }
  );
  console.log('✅ Shop created for seller:', sellerShop.name);

  // Create buyer account
  const buyerPassword = await hash('buyer123', 12);
  const buyer = await User.findOneAndUpdate(
    { email: 'buyer@blocal.bt' },
    {
      name: 'Test Buyer',
      email: 'buyer@blocal.bt',
      password: buyerPassword,
      role: 'BUYER',
      emailVerified: true,
      status: 'active',
      profile: {
        phoneNumber: '17333333',
        address: {
          street: 'Doebum Lam',
          city: 'Thimphu',
          state: 'Thimphu',
          zipCode: '11001',
          country: 'Bhutan'
        }
      }
    },
    { upsert: true, new: true }
  );
  console.log('✅ Buyer account created:', buyer.email);

  return { admin, seller, buyer, sellerShop };
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3

async function dropCollections(collections) {
  for (const collection of collections) {
    try {
      const exists = await mongoose.connection.db.listCollections({ name: collection }).hasNext();
      if (exists) {
        await mongoose.connection.db.dropCollection(collection);
        console.log(`✅ Dropped collection: ${collection}`);
      } else {
        console.log(`ℹ️ Collection ${collection} does not exist, skipping drop.`);
      }
    } catch (error) {
      console.error(`❌ Error dropping collection ${collection}:`, error);
      throw error;
    }
  }
}

async function createOrUpdateUser(email, userData) {
  try {
    const user = await User.findOneAndUpdate({ email }, userData, { upsert: true, new: true });
    console.log(`✅ User created/updated: ${email}`);
    return user;
  } catch (error) {
    console.error(`❌ Error creating/updating user ${email}:`, error);
    throw error;
  }
}

async function createOrUpdateShop(shopData) {
  try {
    const shop = await Shop.findOneAndUpdate({ owner: shopData.owner }, shopData, { upsert: true, new: true });
    console.log(`✅ Shop created/updated: ${shopData.name}`);
    return shop;
  } catch (error) {
    console.error(`❌ Error creating/updating shop ${shopData.name}:`, error);
    throw error;
  }
}

async function createOrUpdateProduct(productData, query) {
  try {
    await Product.findOneAndUpdate(query, productData, { upsert: true, new: true });
    console.log(`✅ Product created/updated: ${productData.name}`);
  } catch (error) {
    console.error(`❌ Error creating/updating product ${productData.name}:`, error);
    throw error;
  }
}

async function createOrUpdateBlog(postData) {
  try {
    await Blog.findOneAndUpdate({ title: postData.title }, postData, { upsert: true, new: true });
    console.log(`✅ Blog post created/updated: ${postData.title}`);
  } catch (error) {
    console.error(`❌ Error creating/updating blog post ${postData.title}:`, error);
    throw error;
  }
}

async function seedDatabase() {
  console.log("⚙️ Seeding data...");

  // Collections to drop before seeding
  const collections = ['users', 'shops', 'products', 'blogs'];
  await dropCollections(collections);

  // Password hashes (reuse to save time)
  const adminPasswordHash = bcrypt.hashSync('admin123', 12);
  const sellerPasswordHash = bcrypt.hashSync('seller123', 12);
  const buyerPasswordHash = bcrypt.hashSync('buyer123', 12);

  // Create admin user
  const admin = await createOrUpdateUser('admin@blocal.bt', {
    email: 'admin@blocal.bt',
    name: 'Admin User',
    password: adminPasswordHash,
    role: 'ADMIN',
    status: 'active',
    emailVerified: true,
    profile: {
      phoneNumber: '+975-17123456',
      address: {
        street: 'Norzin Lam',
        city: 'Thimphu',
        state: 'Thimphu',
        zipCode: '11001',
        country: 'Bhutan'
      }
    }
  });

<<<<<<< HEAD
  // Create seller users
  const seller1 = await createOrUpdateUser('seller1@blocal.bt', {
    email: 'seller1@blocal.bt',
    name: 'John Doe',
    password: sellerPasswordHash,
    role: 'SELLER',
    status: 'active',
    emailVerified: true,
    profile: {
      phoneNumber: '+975-17234567',
      address: {
        street: 'Chang Lam',
        city: 'Thimphu',
        state: 'Thimphu',
        zipCode: '11001',
        country: 'Bhutan'
      }
    }
  });

  const seller2 = await createOrUpdateUser('seller2@blocal.bt', {
    email: 'seller2@blocal.bt',
    name: 'Jane Smith',
    password: sellerPasswordHash,
    role: 'SELLER',
    status: 'active',
    emailVerified: true,
    profile: {
      phoneNumber: '+975-17345678',
      address: {
        street: 'Doebum Lam',
        city: 'Thimphu',
        state: 'Thimphu',
        zipCode: '11001',
        country: 'Bhutan'
      }
    }
  });

  // Create buyer users
  const buyer1 = await createOrUpdateUser('buyer1@blocal.bt', {
    email: 'buyer1@blocal.bt',
    name: 'Alice Johnson',
    password: buyerPasswordHash,
    role: 'BUYER',
    status: 'active',
    emailVerified: true,
    profile: {
      phoneNumber: '+975-17456789',
      address: {
        street: 'Motithang',
        city: 'Thimphu',
        state: 'Thimphu',
        zipCode: '11001',
        country: 'Bhutan'
      }
    }
  });

  // Create shops with different statuses
  const shopsData = [
    {
      name: 'Skye Fresh Market',
      description: 'Premium fresh fruits and vegetables market in Thimphu',
      owner: admin._id,
      address: {
        street: 'Norzin Lam',
        city: 'Thimphu',
        state: 'Thimphu',
        zipCode: '11001',
        country: 'Bhutan'
      },
      phone: '+975-17567890',
      email: 'skyefresh@blocal.bt',
      status: 'active',
      media: {
        logo: '/images/shops/skye-logo.jpg',
        coverImage: '/images/shops/skye-cover.jpg'
=======
    // Create test accounts
    const { admin, seller, buyer, sellerShop } = await createTestAccounts();

    // Create Skye shop
    const shop = await Shop.findOneAndUpdate(
      { owner: admin._id },
      {
        name: 'Skye',
        description: 'Fresh fruits and vegetables market',
        logo: '/images/products/vegetables-hero.jpg',
        address: {
          street: 'Norzin Lam',
          city: 'Thimphu',
          state: 'Thimphu',
          zipCode: '11001',
          country: 'Bhutan'
        },
        status: 'APPROVED',
        isActive: true,
        owner: admin._id
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
      },
      verification: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: admin._id
      },
      statistics: {
        totalSales: 150000,
        totalOrders: 150,
        totalProducts: 25
      },
      rating: {
        average: 4.8,
        count: 45
      }
    },
    {
      name: 'Organic Valley',
      description: '100% organic produce from local farmers',
      owner: seller1._id,
      address: {
        street: 'Chang Lam',
        city: 'Thimphu',
        state: 'Thimphu',
        zipCode: '11001',
        country: 'Bhutan'
      },
      phone: '+975-17678901',
      email: 'organicvalley@blocal.bt',
      status: 'active',
      media: {
        logo: '/images/shops/organic-valley-logo.jpg',
        coverImage: '/images/shops/organic-valley-cover.jpg'
      },
      verification: {
        isVerified: true,
        verifiedAt: new Date(),
        verifiedBy: admin._id
      },
      statistics: {
        totalSales: 85000,
        totalOrders: 85,
        totalProducts: 15
      },
      rating: {
        average: 4.9,
        count: 32
      }
    },
    {
      name: 'Fresh Harvest',
      description: 'Direct from farm to your table',
      owner: seller2._id,
      address: {
        street: 'Doebum Lam',
        city: 'Thimphu',
        state: 'Thimphu',
        zipCode: '11001',
        country: 'Bhutan'
      },
      phone: '+975-17789012',
      email: 'freshharvest@blocal.bt',
      status: 'pending',
      media: {
        logo: '/images/shops/fresh-harvest-logo.jpg',
        coverImage: '/images/shops/fresh-harvest-cover.jpg'
      },
      verification: {
        isVerified: false,
        verifiedAt: null,
        verifiedBy: null
      },
      statistics: {
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0
      },
      rating: {
        average: 0,
        count: 0
      }
    }
  ];

  // Create shops and save references for product creation
  const shops = [];
  for (const shopData of shopsData) {
    const shop = await createOrUpdateShop(shopData);
    shops.push(shop);
  }

<<<<<<< HEAD
  // Helper to create SKU
  const generateSKU = (prefix, name) =>
    `${prefix}-${name.toUpperCase().replace(/-/g, '').substring(0, 3)}-${Math.floor(Math.random() * 1000)}`;

  // Create fruits products concurrently
  const fruits = [
    'apple',
    'banana',
    'blueberry',
    'grapes',
    'mango',
    'orange',
    'strawberries',
    'kiwi',
    'pineapple',
    'watermelon'
  ];

  await Promise.all(
    fruits.map(async (fruit) => {
      const name = fruit.charAt(0).toUpperCase() + fruit.slice(1);
      const slug = fruit.toLowerCase();
      const basePrice = Math.floor(Math.random() * 50) + 50;
      const sku = generateSKU('FR', fruit);

      await createOrUpdateProduct(
=======
    const fruitPrices = {
      'apple': 120, // Price per kg
      'banana': 80,  // Price per dozen
      'blueberry': 250, // Price per box
      'grapes': 180, // Price per kg
      'mango': 150, // Price per kg
      'orange': 100, // Price per kg
      'strawberries': 200 // Price per box
    };

    for (const fruit of fruits) {
      const name = fruit.charAt(0).toUpperCase() + fruit.slice(1);
      const basePrice = fruitPrices[fruit];
      const initialStock = Math.floor(Math.random() * 50) + 30; // Higher initial stock
      
      await Product.findOneAndUpdate(
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
        {
          name,
          slug,
          description: {
            short: `Fresh ${fruit} from local farmers`,
            full: `Our ${fruit} are carefully selected from local farmers to ensure the highest quality and freshness.`,
          },
          media: {
            mainImage: `/images/products/fruits/${fruit}.jpg`,
<<<<<<< HEAD
            gallery: [
              `/images/products/fruits/${fruit}-1.jpg`,
              `/images/products/fruits/${fruit}-2.jpg`,
            ],
          },
          pricing: {
            base: basePrice,
            discounted: +(basePrice * 0.9).toFixed(2),
            discount: 10,
            currency: 'BTN',
          },
          inventory: {
            sku,
            stock: Math.floor(Math.random() * 50) + 10,
            minStock: 5,
            reserved: 0,
=======
            gallery: [] // Remove non-existent gallery images
          },
          pricing: {
            base: basePrice,
            discounted: Math.floor(basePrice * 0.9),
            discount: 10,
            currency: 'Nu.'
          },
          inventory: {
            sku: `FR-${fruit.toUpperCase().substring(0, 3)}-${Math.floor(Math.random() * 1000)}`,
            stock: initialStock,
            minStock: Math.floor(initialStock * 0.2), // 20% of initial stock as minimum
            reserved: 0
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
          },
          category: {
            main: 'FRUITS',
            sub: 'Fresh Fruits',
            tags: ['fresh', 'local', 'organic', slug],
          },
          seller: admin._id,
          shop: shops[0]._id,
          status: 'active',
          varieties: [
            {
              name: 'Regular',
              sku: generateSKU('FR', `${fruit}-REG`),
              price: basePrice,
              stock: {
                current: Math.floor(Math.random() * 50) + 10,
                minimum: 5
              },
              status: 'active'
            },
            {
              name: 'Premium',
              sku: generateSKU('FR', `${fruit}-PRE`),
              price: basePrice * 1.2,
              stock: {
                current: Math.floor(Math.random() * 30) + 5,
                minimum: 3
              },
              status: 'active'
            }
          ]
        },
        { name, shop: shops[0]._id }
      );
<<<<<<< HEAD
    })
  );
=======
      console.log(`Created fruit: ${fruit} with price Nu. ${basePrice}`);
    }
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3

  // Create vegetables concurrently
  const vegetables = [
    'arugula',
    'broccoli',
    'carrot',
    'cucumber',
    'kale',
    'lettuce',
    'potato',
    'spinach',
    'sweet-potato',
    'tomato',
    'bell-pepper',
    'eggplant',
    'zucchini',
    'cauliflower',
    'cabbage'
  ];

<<<<<<< HEAD
  await Promise.all(
    vegetables.map(async (vegetable) => {
      const normalizedName = vegetable.replace(/-/g, ' ');
      const name = normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1);
      const slug = vegetable.toLowerCase();
      const basePrice = Math.floor(Math.random() * 30) + 20;
      const sku = generateSKU('VEG', vegetable);
=======
    const vegPrices = {
      'arugula': 80, // Price per bunch
      'broccoli': 120, // Price per head
      'carrot': 60, // Price per kg
      'cucumber': 40, // Price per kg
      'kale': 70, // Price per bunch
      'lettuce': 90, // Price per head
      'potato': 50, // Price per kg
      'spinach': 60, // Price per bunch
      'sweet-potato': 70, // Price per kg
      'tomato': 80 // Price per kg
    };

    for (const vegetable of vegetables) {
      const name = vegetable.charAt(0).toUpperCase() + vegetable.slice(1).replace('-', ' ');
      const slug = vegetable.toLowerCase();
      const basePrice = vegPrices[vegetable];
      const initialStock = Math.floor(Math.random() * 50) + 40; // Higher initial stock for vegetables
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3

      await createOrUpdateProduct(
        {
          name,
          slug,
          description: {
            short: `Fresh ${normalizedName} from local farms`,
            full: `Our ${normalizedName} are grown organically and harvested at peak freshness.`,
          },
          media: {
            mainImage: `/images/products/vegetables/${vegetable}.jpg`,
<<<<<<< HEAD
            gallery: [
              `/images/products/vegetables/${vegetable}-1.jpg`,
              `/images/products/vegetables/${vegetable}-2.jpg`,
            ],
          },
          pricing: {
            base: basePrice,
            discounted: +(basePrice * 0.85).toFixed(2),
            discount: 15,
            currency: 'BTN',
          },
          inventory: {
            sku,
            stock: Math.floor(Math.random() * 50) + 10,
            minStock: 5,
            reserved: 0,
=======
            gallery: [] // Remove non-existent gallery images
          },
          pricing: {
            base: basePrice,
            discounted: Math.floor(basePrice * 0.9),
            discount: 10,
            currency: 'Nu.'
          },
          inventory: {
            sku: `VEG-${vegetable.toUpperCase().replace('-', '').substring(0, 3)}-${Math.floor(Math.random() * 1000)}`,
            stock: initialStock,
            minStock: Math.floor(initialStock * 0.2), // 20% of initial stock as minimum
            reserved: 0
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
          },
          category: {
            main: 'VEGETABLES',
            sub: 'Fresh Vegetables',
            tags: ['fresh', 'local', 'organic', slug],
          },
          seller: admin._id,
          shop: shops[0]._id,
          status: 'active',
          varieties: [
            {
              name: 'Regular',
              sku: generateSKU('VEG', `${vegetable}-REG`),
              price: basePrice,
              stock: {
                current: Math.floor(Math.random() * 50) + 10,
                minimum: 5
              },
              status: 'active'
            },
            {
              name: 'Organic',
              sku: generateSKU('VEG', `${vegetable}-ORG`),
              price: basePrice * 1.3,
              stock: {
                current: Math.floor(Math.random() * 30) + 5,
                minimum: 3
              },
              status: 'active'
            }
          ]
        },
        { name, shop: shops[0]._id }
      );
<<<<<<< HEAD
    })
  );

  // Blog posts data with more varied categories and content
  const blogs = [
    {
      title: 'Sustainable Farming in Bhutan',
      slug: 'sustainable-farming-bhutan',
      content: 'Bhutan is leading the way in sustainable farming practices...',
      summary: 'Discover how Bhutan is pioneering sustainable farming methods',
      author: admin._id,
      publishedAt: new Date('2024-04-01'),
      status: 'PUBLISHED',
      category: 'FARMING',
      tags: ['sustainability', 'farming', 'bhutan', 'organic'],
      media: {
        featuredImage: '/images/blogs/sustainable-farming.jpg'
      }
    },
    {
      title: 'Top 5 Fruits to Boost Your Immunity',
      slug: 'top-5-fruits-boost-immunity',
      content: 'Discover the best fruits that can help strengthen your immune system...',
      summary: 'Learn about the most nutritious fruits for your health',
      author: seller1._id,
      publishedAt: new Date('2024-04-15'),
      status: 'PUBLISHED',
      category: 'NUTRITION',
      tags: ['health', 'fruits', 'immunity', 'nutrition'],
      media: {
        featuredImage: '/images/blogs/immune-fruits.jpg'
      }
    },
    {
      title: 'Seasonal Vegetables Guide',
      slug: 'seasonal-vegetables-guide',
      content: 'Understanding which vegetables are in season can help you plan your meals better...',
      summary: 'A comprehensive guide to seasonal vegetables in Bhutan',
      author: seller2._id,
      publishedAt: new Date('2024-04-20'),
      status: 'PUBLISHED',
      category: 'RECIPES',
      tags: ['vegetables', 'seasonal', 'cooking', 'recipes'],
      media: {
        featuredImage: '/images/blogs/seasonal-vegetables.jpg'
      }
    },
    {
      title: 'Organic Farming Benefits',
      slug: 'organic-farming-benefits',
      content: 'The benefits of organic farming extend beyond just healthy produce...',
      summary: 'Explore the environmental and health benefits of organic farming',
      author: admin._id,
      publishedAt: new Date('2024-04-25'),
      status: 'PUBLISHED',
      category: 'SUSTAINABILITY',
      tags: ['organic', 'farming', 'environment', 'sustainability'],
      media: {
        featuredImage: '/images/blogs/organic-farming.jpg'
      }
    }
  ];

  for (const post of blogs) {
    await createOrUpdateBlog(post);
=======
      console.log(`Created vegetable: ${vegetable} with price Nu. ${basePrice}`);
    }

    console.log('\nTest Accounts Created Successfully!');
    console.log('\nLogin Credentials:');
    console.log('------------------');
    console.log('Admin:');
    console.log('Email: admin@blocal.bt');
    console.log('Password: admin123');
    console.log('\nSeller:');
    console.log('Email: seller@blocal.bt');
    console.log('Password: seller123');
    console.log('\nBuyer:');
    console.log('Email: buyer@blocal.bt');
    console.log('Password: buyer123');

    console.log('\nDatabase seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
>>>>>>> ce08c47481366906128db17c6bd3eaf53dc5d6a3
  }

  console.log("🎉 Seeding complete!");
  process.exit(0);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return seedDatabase();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
