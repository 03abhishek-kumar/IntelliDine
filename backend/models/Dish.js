const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Signature', 'Premium', 'Classic', 'Dessert'], required: true },
  prepTime: { type: Number, required: true }, // Base time in mins
  price: { type: Number, required: true },
  ingredients: [{
    ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
    quantity: { type: Number, required: true } // Quantity required per instance of dish
  }]
});

module.exports = mongoose.model('Dish', dishSchema);
