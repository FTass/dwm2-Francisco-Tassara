// database/repo/order/orderItem_repo.js
const OrderItem = require('../../models/order/OrderItem.js');

class OrderItemRepository {
  async create(data) {
    data.createdAt = new Date();
    return await OrderItem.create(data);
  }

  async findById(id) {
    return await OrderItem.findById(id);
  }

  async findByOrder(orderId) {
    return await OrderItem.find({ orderId }).sort({ createdAt: -1 });
  }

  async updateById(id, data) {
    data.updatedAt = new Date();
    return await OrderItem.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  }

  async deleteById(id) {
    return await OrderItem.findByIdAndDelete(id);
  }
}

module.exports = new OrderItemRepository();
