const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

const priorityRank = {
  high: 3,
  medium: 2,
  low: 1,
};

router.post('/', async (req, res) => {
  try {
    const { items, prepTime, priority, status } = req.body;
    const order = await Order.create({ items, prepTime, priority, status });
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create order', error: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const orders = await Order.find();
    const sortedOrders = orders.sort((a, b) => {
      const priorityDiff = (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      return a.prepTime - b.prepTime;
    });
    return res.status(200).json(sortedOrders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update order status', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to delete order', error: error.message });
  }
});

module.exports = router;
