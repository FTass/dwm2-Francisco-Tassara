const Payment = require('../../models/payment/Payment.js');

class PaymentRepository {
  async create(data) {
    data.createdAt = new Date();
    return await Payment.create(data);
  }

  async findById(id) {
    return await Payment.findById(id);
  }

  async findByOrder(orderId) {
    return await Payment.find({ orderId }).sort({ createdAt: -1 });
  }

  async updateById(id, data) {
    return await Payment.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Payment.findByIdAndDelete(id);
  }
}

module.exports = new PaymentRepository();
