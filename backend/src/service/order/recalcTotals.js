// src/service/order/recalcTotals.js
const mongoose = require('mongoose');
const Order = require('../../../database/models/order/Order.js');
const OrderItem = require('../../../database/models/order/OrderItem.js');

function round2(n) {
  return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
}

/**
 * Recalcula subTotal como suma de items.subTotal
 * y total = subTotal + tax, redondeado a 2 decimales.
 */
async function recalcOrderTotals(orderId) {
  const oid = new mongoose.Types.ObjectId(orderId);

  const aggr = await OrderItem.aggregate([
    { $match: { orderId: oid } },
    { $group: { _id: '$orderId', subTotal: { $sum: '$subTotal' } } }
  ]);

  const subTotal = aggr[0]?.subTotal || 0;
  const order = await Order.findById(orderId).lean();
  if (!order) return null;

  const tax = typeof order.tax === 'number' ? order.tax : 0;
  const total = round2(subTotal + tax);

  const updated = await Order.findByIdAndUpdate(
    orderId,
    { subTotal, total, updatedAt: new Date() },
    { new: true, runValidators: true, context: 'query' }
  ).lean();

  return updated;
}

module.exports = { recalcOrderTotals, round2 };
