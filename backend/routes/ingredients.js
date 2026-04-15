const express = require('express');
const Ingredient = require('../models/Ingredient');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, quantity, unit, threshold, lastRestocked } = req.body;
    const ingredient = await Ingredient.create({ name, quantity, unit, threshold, lastRestocked });
    return res.status(201).json(ingredient);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to add ingredient', error: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    return res.status(200).json(ingredients);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch ingredients', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      return res.status(400).json({ message: 'quantity must be a number' });
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true, runValidators: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    return res.status(200).json(updatedIngredient);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update ingredient quantity', error: error.message });
  }
});

router.get('/low-stock', async (_req, res) => {
  try {
    const lowStockItems = await Ingredient.find({
      $expr: { $lt: ['$quantity', '$threshold'] },
    }).sort({ quantity: 1 });

    return res.status(200).json(lowStockItems);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch low stock ingredients', error: error.message });
  }
});

module.exports = router;
