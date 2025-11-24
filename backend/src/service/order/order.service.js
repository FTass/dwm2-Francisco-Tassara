// src/service/order/order.service.js
const repo = require('../../../database/repo/order/order_repo.js');
const { recalcOrderTotals } = require('./recalcTotals');

const POPULATE_ORDERS = [
  { path: 'userId', select: 'firstName lastName email' }, // sin profile
  { path: 'addressId', populate: { path: 'userId', select: 'firstName' } },
];

const addOrder = async (data) => {
  if (!data.orderNumber) throw new Error('Missing orderNumber');
  if (!data.userId) throw new Error('Missing userId');
  if (!data.addressId) throw new Error('Missing addressId');
  if (typeof data.subTotal !== 'number') throw new Error('Missing subTotal');
  if (typeof data.tax !== 'number') throw new Error('Missing tax');

  // NO setees total aquí; se recalcula con items o via tax-change
  data.status = data.status || 'pending_payment';

  const exists = await repo.findByNumber(data.orderNumber);
  if (exists) {
    const e = new Error('Order number already exists');
    e.status = 409;
    throw e;
  }

  const created = await repo.create(data);

  // Recalcula totales iniciales (por si hay subTotal inicial o tax definido)
  // await recalcOrderTotals(created._id);

  return created;
};

const getOrders = async (query = {}) => {
  const { status, userId, orderNumber, page, limit } = query;
  const filter = {};
  if (status) filter.status = status;
  if (userId) filter.userId = userId;
  if (orderNumber) filter.orderNumber = orderNumber;

  const options = {
    limit: limit ? Number(limit) : 50,
    page: page ? Number(page) : 1,
    populate: POPULATE_ORDERS,
    lean: true,
  };

  return await repo.findAll(filter, options);
};

const getOrderById = async (orderId) => {
  const order = await repo.findById(orderId, { populate: POPULATE_ORDERS, lean: true });
  if (!order) {
    const e = new Error('Order not found');
    e.status = 404;
    throw e;
  }
  return order;
};

const updateOrder = async (orderId, data) => {
  const updated = await repo.updateById(orderId, data);
  if (!updated) {
    const e = new Error('Order not found');
    e.status = 404;
    throw e;
  }

  // Si cambió el tax, recalculamos total con el subTotal actual
  if (data.tax != null) {
    await recalcOrderTotals(orderId);
  }
  return updated;
};

const deleteOrder = async (orderId) => {
  const deleted = await repo.deleteById(orderId);
  if (!deleted) {
    const e = new Error('Order not found');
    e.status = 404;
    throw e;
  }
  return deleted;
};

module.exports = {
  addOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
