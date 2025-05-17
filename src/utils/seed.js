import mongoose from 'mongoose';
import pkg from 'bcryptjs';
const { hash } = pkg;
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Blog from '../models/Blog.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blocal';

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

    // Create admin user
    const adminPassword = await hash('admin123', 12);
    const admin = await User.findOneAndUpdate(
      { email: 'admin@blocal.bt' },
      {
        email: 'admin@blocal.bt',
        name: 'Admin',
        password: adminPassword,
        role: 'ADMIN',
      },
      { upsert: true, new: true }
    );

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

    for (const fruit of fruits) {
      const name = fruit.charAt(0).toUpperCase() + fruit.slice(1);
      const basePrice = Math.floor(Math.random() * 50) + 50; // Random price between 50-100
      
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
            gallery: [
              `/images/products/fruits/${fruit}-1.jpg`,
              `/images/products/fruits/${fruit}-2.jpg`
            ]
          },
          pricing: {
            base: basePrice,
            discounted: basePrice * 0.9,
            discount: 10,
            currency: 'BTN'
          },
          inventory: {
            sku: `FR-${fruit.toUpperCase().substring(0, 3)}-${Math.floor(Math.random() * 1000)}`,
            stock: Math.floor(Math.random() * 50) + 10,
            minStock: 5,
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
      console.log(`Created fruit: ${fruit}`);
    }

    // Add vegetables
    const vegetables = [
      'arugula', 'broccoli', 'carrot', 'cucumber', 
      'kale', 'lettuce', 'potato', 'spinach', 
      'sweet-potato', 'tomato'
    ];

    for (const vegetable of vegetables) {
      const name = vegetable.charAt(0).toUpperCase() + vegetable.slice(1).replace('-', ' ');
      const slug = vegetable.toLowerCase();
      const basePrice = Math.floor(Math.random() * 30) + 20; // Random price between 20-50

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
            gallery: [
              `/images/products/vegetables/${vegetable}-1.jpg`,
              `/images/products/vegetables/${vegetable}-2.jpg`
            ]
          },
          pricing: {
            base: basePrice,
            discounted: basePrice * 0.9,
            discount: 10,
            currency: 'BTN'
          },
          inventory: {
            sku: `VEG-${vegetable.toUpperCase().replace('-', '').substring(0, 3)}-${Math.floor(Math.random() * 1000)}`,
            stock: Math.floor(Math.random() * 50) + 10,
            minStock: 5,
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
      console.log(`Created vegetable: ${vegetable}`);
    }

    // Add sample blog posts
    const blogPosts = [
      {
        title: "The Benefits of Eating Local",
        content: "Eating local food has numerous benefits for both your health and the environment. When you choose local produce, you're getting the freshest possible food while supporting local farmers and reducing transportation emissions...",
        summary: "Discover why eating local food is better for you and the environment",
        category: "SUSTAINABILITY",
        tags: ["local food", "sustainability", "health"],
        status: "PUBLISHED",
        media: {
          featuredImage: "/images/blog/local-food.jpg"
        }
      },
      {
        title: "Seasonal Vegetables Guide",
        content: "Understanding which vegetables are in season can help you plan your meals better and ensure you're getting the most nutritious produce. This guide will help you navigate through seasonal vegetables in Bhutan...",
        summary: "Learn about seasonal vegetables in Bhutan",
        category: "FARMING",
        tags: ["seasonal", "vegetables", "farming"],
        status: "PUBLISHED",
        media: {
          featuredImage: "/images/blog/seasonal-vegetables.jpg"
        }
      },
      {
        title: "Simple Farm-to-Table Recipes",
        content: "Make the most of your local produce with these simple yet delicious recipes. From fresh salads to hearty soups, we've got you covered with recipes that celebrate local ingredients...",
        summary: "Easy recipes using local ingredients",
        category: "RECIPES",
        tags: ["recipes", "cooking", "local ingredients"],
        status: "PUBLISHED",
        media: {
          featuredImage: "/images/blog/recipes.jpg"
        }
      }
    ];

    for (const post of blogPosts) {
      await Blog.findOneAndUpdate(
        { title: post.title },
        {
          ...post,
          author: admin._id,
          publishedAt: new Date()
        },
        { upsert: true }
      );
      console.log(`Created blog post: ${post.title}`);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

// Run the seed function
seed(); 