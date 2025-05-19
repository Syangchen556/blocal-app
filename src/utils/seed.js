import mongoose from 'mongoose';
import pkg from 'bcryptjs';
const { hash } = pkg;
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Blog from '../models/Blog.js';
import connectDB from '../lib/mongodb.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blocal';

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

    // Drop existing collections
    const collections = ['users', 'shops', 'products', 'blogs'];
    for (const collection of collections) {
      try {
        await mongoose.connection.db.dropCollection(collection);
        console.log(`Dropped ${collection} collection`);
      } catch (error) {
        // Collection might not exist, which is fine
        console.log(`Collection ${collection} might not exist, continuing...`);
      }
    }

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
      },
      { upsert: true, new: true }
    );

    // Add fruits
    const fruits = [
      'apple', 'banana', 'blueberry', 'grapes', 
      'mango', 'orange', 'strawberries'
    ];

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
        {
          name: name,
          shop: shop._id
        },
        {
          name: name,
          slug: fruit.toLowerCase(),
          description: {
            short: `Fresh ${fruit} from local farmers`,
            full: `Our ${fruit} are carefully selected from local farmers to ensure the highest quality and freshness. Perfect for your daily fruit intake and healthy lifestyle.`
          },
          media: {
            mainImage: `/images/products/fruits/${fruit}.jpg`,
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
          },
          category: {
            main: 'FRUITS',
            sub: 'Fresh Fruits',
            tags: ['fresh', 'local', 'organic', fruit.toLowerCase()]
          },
          specifications: [
            {
              name: 'Origin',
              value: 'Bhutan',
              group: 'Source'
            },
            {
              name: 'Farming Method',
              value: 'Organic',
              group: 'Production'
            },
            {
              name: 'Storage',
              value: 'Keep refrigerated',
              group: 'Handling'
            }
          ],
          varieties: [
            {
              name: 'Regular',
              sku: `FR-${fruit.toUpperCase().substring(0, 3)}-REG`,
              price: basePrice,
              stock: {
                current: Math.floor(Math.random() * 30) + 10,
                minimum: 5
              },
              status: 'active'
            },
            {
              name: 'Premium',
              sku: `FR-${fruit.toUpperCase().substring(0, 3)}-PRE`,
              price: basePrice * 1.2,
              stock: {
                current: Math.floor(Math.random() * 20) + 5,
                minimum: 3
              },
              status: 'active'
            }
          ],
          seller: admin._id,
          shop: shop._id,
          status: 'active',
          seo: {
            title: `Fresh ${name} - Locally Grown in Bhutan`,
            description: `Buy fresh, organic ${fruit} directly from local Bhutanese farmers. Premium quality, sustainably grown.`,
            keywords: ['fresh', 'organic', fruit, 'local', 'Bhutan', 'farmers market']
          }
        },
        { upsert: true }
      );
      console.log(`Created fruit: ${fruit} with price Nu. ${basePrice}`);
    }

    // Add vegetables
    const vegetables = [
      'arugula', 'broccoli', 'carrot', 'cucumber', 
      'kale', 'lettuce', 'potato', 'spinach', 
      'sweet-potato', 'tomato'
    ];

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

      await Product.findOneAndUpdate(
        {
          name: name,
          shop: shop._id
        },
        {
          name: name,
          slug: slug,
          description: {
            short: `Fresh ${vegetable.replace('-', ' ')} from local farmers`,
            full: `Our ${vegetable.replace('-', ' ')} are carefully selected from local farmers to ensure the highest quality and freshness. Perfect for your daily vegetable intake and healthy cooking.`
          },
          media: {
            mainImage: `/images/products/vegetables/${vegetable}.jpg`,
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
          },
          category: {
            main: 'VEGETABLES',
            sub: 'Fresh Vegetables',
            tags: ['fresh', 'local', 'organic', vegetable.toLowerCase().replace('-', ' ')]
          },
          specifications: [
            {
              name: 'Origin',
              value: 'Bhutan',
              group: 'Source'
            },
            {
              name: 'Farming Method',
              value: 'Organic',
              group: 'Production'
            },
            {
              name: 'Storage',
              value: 'Keep refrigerated',
              group: 'Handling'
            },
            {
              name: 'Packaging',
              value: 'Eco-friendly',
              group: 'Packaging'
            }
          ],
          varieties: [
            {
              name: 'Regular',
              sku: `VEG-${vegetable.toUpperCase().replace('-', '').substring(0, 3)}-REG`,
              price: basePrice,
              stock: {
                current: Math.floor(Math.random() * 30) + 10,
                minimum: 5
              },
              status: 'active'
            },
            {
              name: 'Premium',
              sku: `VEG-${vegetable.toUpperCase().replace('-', '').substring(0, 3)}-PRE`,
              price: basePrice * 1.2,
              stock: {
                current: Math.floor(Math.random() * 20) + 5,
                minimum: 3
              },
              status: 'active'
            }
          ],
          seller: admin._id,
          shop: shop._id,
          status: 'active',
          seo: {
            title: `Fresh ${name} - Locally Grown in Bhutan`,
            description: `Buy fresh, organic ${vegetable.replace('-', ' ')} directly from local Bhutanese farmers. Premium quality, sustainably grown.`,
            keywords: ['fresh', 'organic', vegetable.replace('-', ' '), 'local', 'Bhutan', 'farmers market']
          }
        },
        { upsert: true }
      );
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
  }
}

// Run the seed function
seed(); 