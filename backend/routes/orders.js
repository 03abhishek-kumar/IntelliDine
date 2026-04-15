const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Dish = require('../models/Dish');
const Ingredient = require('../models/Ingredient');

const router = express.Router();

const priorityRank = { urgent: 4, high: 3, medium: 2, low: 1 };

router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { items, customerId, priority = 'medium' } = req.body;

    // 1. Fetch requested dishes to accumulate total prep time and ingredient demands
    let totalPrepTime = 0;
    const ingredientDemands = {}; // Map ingredientId -> required amount

    // items is expected to be array of: { dishId, quantity }
    for (const item of items) {
      const dish = await Dish.findById(item.dishId).session(session);
      if (!dish) throw new Error(`Dish not found: ${item.dishId}`);

      totalPrepTime += (dish.prepTime * item.quantity);

      for (const reqIng of dish.ingredients) {
        const idStr = reqIng.ingredientId.toString();
        ingredientDemands[idStr] = (ingredientDemands[idStr] || 0) + (reqIng.quantity * item.quantity);
      }
    }

    // 2. Perform Real-Time Inventory Depletion (Problem Statement 1)
    const lowStockAlerts = [];
    for (const [ingId, reqAmount] of Object.entries(ingredientDemands)) {
      const ing = await Ingredient.findById(ingId).session(session);
      if (ing.quantity < reqAmount) {
        throw new Error(`Out of stock for ingredient: ${ing.name}. Required: ${reqAmount}, Available: ${ing.quantity}`);
      }
      ing.quantity -= reqAmount;
      await ing.save({ session });

      // Check if threshold breached
      if (ing.quantity < ing.threshold) {
        lowStockAlerts.push({ name: ing.name, remaining: ing.quantity, threshold: ing.threshold });
      }
    }

    // 3. Kitchen Load Prediction & Priority (Problem Statement 2)
    // Find all currently pending and cooking orders to assess workload
    const activeOrders = await Order.find({ status: { $in: ['pending', 'cooking'] } }).session(session);
    const kitchenLoadMinutes = activeOrders.reduce((acc, order) => acc + order.prepTime, 0);
    
    // Estimate completion time
    const estimatedCompletionTime = new Date(Date.now() + (kitchenLoadMinutes + totalPrepTime) * 60000);

    // Calculate dynamic priority score (urgency * (100 - kitchenLoad factor))
    const baseScore = priorityRank[priority] * 1000;
    const dynamicPriorityScore = baseScore - kitchenLoadMinutes; // orders with less kitchen load in front get slightly prioritized, wait no. Actually, high priority overrides load.

    const order = new Order({
      items,
      customerId,
      prepTime: totalPrepTime,
      estimatedCompletionTime,
      priority,
      dynamicPriorityScore,
      status: 'pending'
    });

    await order.save({ session });
    await session.commitTransaction();
    session.endSession();

    const populatedOrder = await Order.findById(order._id)
      .populate('items.dishId')
      .populate('customerId', 'name');

    // Notify Chef Dashboard of new order
    if (req.io) {
      req.io.emit('new_order', populatedOrder);
      if (lowStockAlerts.length > 0) {
        req.io.emit('inventory_alert', lowStockAlerts);
      }
    }

    return res.status(201).json({ order: populatedOrder, alerts: lowStockAlerts });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: 'Failed to create order', error: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.dishId')
      .populate('customerId', 'name')
      .sort({ status: 1, dynamicPriorityScore: -1, createdAt: 1 }); // Sorted intelligently
    
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status is required' });

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.dishId').populate('customerId', 'name');

    if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });

    if (req.io) req.io.emit('order_updated', updatedOrder);

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update order status', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
    
    if (req.io) req.io.emit('order_deleted', req.params.id);

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to delete order', error: error.message });
  }
});

module.exports = router;
