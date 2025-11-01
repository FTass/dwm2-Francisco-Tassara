const { request, response } = require('express');
const service = require('../../service/order/payment.service.js');

const paymentsGet = async (req = request, res = response) => {
  try {
    const { orderId } = req.params;
    const payments = await service.getPayments(orderId);
    return res.status(200).json({ msg: 'Payments fetched', data: payments });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const paymentGet = async (req = request, res = response) => {
  try {
    const { orderId, paymentId } = req.params;
    const payment = await service.getPayment(orderId, paymentId);
    return res.status(200).json({ msg: 'Payment fetched', data: payment });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const paymentPost = async (req = request, res = response) => {
  try {
    const { orderId } = req.params;
    const created = await service.addPayment(orderId, req.body);
    return res.status(201).json({ msg: 'Payment created', data: created });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const paymentVerify = async (req = request, res = response) => {
  try {
    const { orderId, paymentId } = req.params;
    const verified = await service.verifyPayment(orderId, paymentId);
    return res.status(200).json({ msg: 'Payment verified', data: verified });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const paymentRefund = async (req = request, res = response) => {
  try {
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
  paymentRefund,
};
