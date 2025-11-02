const { request, response } = require('express');
const service = require('../../service/order/payment.service.js');
const orderService = require('../../service/order/order.service.js');
const { ensureOwnerAdmin, isAdmin } = require('../../utils/access.js');

const paymentsGet = async (req = request, res = response) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ msg: 'Missing orderId' });
    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (!ensureOwnerAdmin(res, order.userId, req.user)) return;
    const payments = await service.getPayments(orderId);
    return res.status(200).json({ msg: 'Payments fetched', data: payments });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const paymentGet = async (req = request, res = response) => {
  try {
    const { orderId, paymentId } = req.params;
    if (!orderId || !paymentId) return res.status(400).json({ msg: 'Missing params' });
    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (!ensureOwnerAdmin(res, order.userId, req.user)) return;
    const payment = await service.getPayment(orderId, paymentId);
    return res.status(200).json({ msg: 'Payment fetched', data: payment });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const paymentPost = async (req = request, res = response) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ msg: 'Missing orderId' });
    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (!ensureOwnerAdmin(res, order.userId, req.user)) return;
    const created = await service.addPayment(orderId, req.body);
    return res.status(201).json({ msg: 'Payment created', data: created });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const paymentVerify = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden' });
    const { orderId, paymentId } = req.params;
    const verified = await service.verifyPayment(orderId, paymentId);
    return res.status(200).json({ msg: 'Payment verified', data: verified });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const paymentRefund = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden' });
    const { orderId, paymentId } = req.params;
    const refunded = await service.refundPayment(orderId, paymentId);
    return res.status(200).json({ msg: 'Payment refunded', data: refunded });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

module.exports = {
  paymentsGet,
  paymentGet,
  paymentPost,
  paymentVerify,
  paymentRefund
};
