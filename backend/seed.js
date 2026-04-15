require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Order = require('./models/Order');
const Ingredient = require('./models/Ingredient');

const sampleOrders = [
  { orderId: 'ORD-0001', items: ['Subz-e-Biryani', 'Raita'], prepTime: 18, priority: 'high', status: 'pending' },
  { orderId: 'ORD-0002', items: ['Murgh-e-Khaas', 'Naan'], prepTime: 24, priority: 'high', status: 'cooking' },
  { orderId: 'ORD-0003', items: ['Zaikedaar Paneer', 'Jeera Rice'], prepTime: 16, priority: 'medium', status: 'pending' },
  { orderId: 'ORD-0004', items: ['Dum Gosht', 'Rumali Roti'], prepTime: 28, priority: 'medium', status: 'done' },
  { orderId: 'ORD-0005', items: ['Noorani Kheer'], prepTime: 10, priority: 'low', status: 'pending' },
];

const sampleIngredients = [
  { name: 'Basmati Rice', quantity: 12000, unit: 'grams', threshold: 3000 },
  { name: 'Chicken', quantity: 45, unit: 'pieces', threshold: 12 },
  { name: 'Paneer', quantity: 6000, unit: 'grams', threshold: 1500 },
  { name: 'Cooking Oil', quantity: 20, unit: 'liters', threshold: 6 },
  { name: 'Tomatoes', quantity: 9000, unit: 'grams', threshold: 2000 },
  { name: 'Onions', quantity: 14000, unit: 'grams', threshold: 3500 },
  { name: 'Cream', quantity: 8, unit: 'liters', threshold: 2 },
  { name: 'Saffron', quantity: 350, unit: 'grams', threshold: 100 },
];

const seed = async () => {
  try {
    await connectDB();

    await Order.deleteMany({});
    await Ingredient.deleteMany({});

    await Order.insertMany(sampleOrders);
    await Ingredient.insertMany(sampleIngredients);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seed();
