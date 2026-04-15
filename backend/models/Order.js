const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
    },
    items: {
      type: [String],
      required: true,
      default: [],
    },
    prepTime: {
      type: Number,
      required: true,
      min: 0,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'cooking', 'done'],
      required: true,
      default: 'pending',
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

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
