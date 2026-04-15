require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Ingredient = require('./models/Ingredient');
const Dish = require('./models/Dish');
const Order = require('./models/Order');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Order.deleteMany();
    await Dish.deleteMany();
    await Ingredient.deleteMany();

    console.log('Seeding Users...');
    for (const u of [
      { name: 'Customer One', email: 'customer@intellidine.com', role: 'customer', password: 'password' },
      { name: 'Head Chef', email: 'chef@intellidine.com', role: 'chef', password: 'password' },
      { name: 'Front Desk', email: 'reception@intellidine.com', role: 'reception', password: 'password' }
    ]) {
      await User.create(u);
    }

    console.log('Seeding Ingredients...');
    const ingredients = await Ingredient.insertMany([
      { name: 'Basmati Rice', quantity: 5000, unit: 'grams', threshold: 1000 },
      { name: 'Chicken', quantity: 2000, unit: 'grams', threshold: 800 },
      { name: 'Paneer', quantity: 1500, unit: 'grams', threshold: 500 },
      { name: 'Spices', quantity: 500, unit: 'grams', threshold: 100 },
      { name: 'Milk', quantity: 5, unit: 'liters', threshold: 2 }
    ]);

    const getIngId = (name) => ingredients.find(i => i.name === name)._id;

    console.log('Seeding Dishes...');
    await Dish.insertMany([
      {
        name: 'Subz-e-Biryani', type: 'Signature', prepTime: 20, price: 15,
        ingredients: [{ ingredientId: getIngId('Basmati Rice'), quantity: 200 }, { ingredientId: getIngId('Spices'), quantity: 10 }]
      },
      {
        name: 'Murgh-e-Khaas', type: 'Premium', prepTime: 25, price: 22,
        ingredients: [{ ingredientId: getIngId('Chicken'), quantity: 300 }, { ingredientId: getIngId('Spices'), quantity: 15 }]
      },
      {
        name: 'Zaikedaar Paneer', type: 'Classic', prepTime: 15, price: 18,
        ingredients: [{ ingredientId: getIngId('Paneer'), quantity: 200 }, { ingredientId: getIngId('Spices'), quantity: 10 }]
      },
      {
        name: 'Noorani Kheer', type: 'Dessert', prepTime: 10, price: 8,
        ingredients: [{ ingredientId: getIngId('Milk'), quantity: 0.5 }, { ingredientId: getIngId('Basmati Rice'), quantity: 50 }]
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
