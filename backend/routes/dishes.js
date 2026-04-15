const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');

router.get('/', async (req, res) => {
  try {
    const dishes = await Dish.find().populate('ingredients.ingredientId', 'name unit');
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
