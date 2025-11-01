const repo = require('../../../database/repo/order/payment_repo.js');

class PaymentService {
  async addPayment(orderId, data) {
    if (!orderId) {
      const e = new Error('Missing orderId');
      e.status = 400;
      throw e;
    }
    if (!data.method || !['transfer', 'webpay'].includes(data.method)) {
      const e = new Error('Invalid or missing payment method');
      e.status = 400;
      throw e;
    }
    if (typeof data.amount !== 'number' || data.amount <= 0) {
      const e = new Error('Invalid payment amount');
      e.status = 400;
      throw e;
    }
    if (!data.transactionId || !data.idempotencyKey) {
      const e = new Error('Missing transactionId or idempotencyKey');
      e.status = 400;
      throw e;
    }

    const payload = {
      orderId,
      method: data.method,
      amount: data.amount,
      status: data.status || 'pending',
      transactionId: data.transactionId,
      idempotencyKey: data.idempotencyKey
    };

    return await repo.create(payload);
  }

  async getPayments(orderId) {
    if (!orderId) {
      const e = new Error('Missing orderId');
      e.status = 400;
      throw e;
    }
    return await repo.findByOrder(orderId);
  }

  async getPayment(orderId, paymentId) {
    const payment = await repo.findById(paymentId);
    if (!payment) {
      const e = new Error('Payment not found');
      e.status = 404;
      throw e;
    }
    if (String(payment.orderId) !== String(orderId)) {
      const e = new Error('Order mismatch');
      e.status = 409;
      throw e;
    }
    return payment;
  }

  async verifyPayment(orderId, paymentId) {
    const payment = await this.getPayment(orderId, paymentId);
    if (payment.status === 'paid') return payment;
    const updated = await repo.updateById(paymentId, { status: 'paid' });
    return updated;
  }

  async refundPayment(orderId, paymentId) {
    const payment = await this.getPayment(orderId, paymentId);
    if (payment.status !== 'paid') {
      const e = new Error('Cannot refund unpaid transaction');
      e.status = 400;
      throw e;
    }
    const refunded = await repo.updateById(paymentId, { status: 'failed' });
    return refunded;
  }
}

module.exports = new PaymentService();
