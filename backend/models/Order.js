const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
    },
    items: [{
      dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
      quantity: { type: Number, default: 1 }
    }],
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    prepTime: { // Base sum of prep times for the items
      type: Number,
      required: true,
      min: 0,
    },
    estimatedCompletionTime: { // Based on kitchen pipeline calculation
      type: Date
    },
    priority: { // Base static priority given to Customer type
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      required: true,
      default: 'medium',
    },
    dynamicPriorityScore: { // Computed real-time score to place high above others
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'cooking', 'ready', 'done'],
      required: true,
      default: 'pending',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } } // needed updatedAt to track when chef hits "cooking"
);

// We keep the old orderId generator
orderSchema.pre('validate', async function assignOrderId() {
  if (this.orderId) {
    return;
  }
  const lastOrder = await this.constructor.findOne().sort({ createdAt: -1 }).select('orderId');
  const lastOrderNumber = lastOrder?.orderId ? parseInt(lastOrder.orderId.replace('ORD-', ''), 10) : 0;
  const nextOrderNumber = Number.isNaN(lastOrderNumber) ? 1 : lastOrderNumber + 1;
  this.orderId = `ORD-${String(nextOrderNumber).padStart(4, '0')}`;
});

module.exports = mongoose.model('Order', orderSchema);
