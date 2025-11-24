const Cart = require('../../models/order/Cart.js');

class CartRepository {
  
  async create(data) {
    data.createdAt = new Date();
    data.updatedAt = new Date();
    return await Cart.create(data);
  }

  async findById(id) {
    return await Cart.findById(id);
  }

  async findAll(filter = {}) {
    return await Cart.find(filter).sort({ createdAt: -1 });
  }

  async findByUser(userId) {
    return await Cart.findOne({ userId });
  }

  async updateById(id, data) {
    data.updatedAt = new Date();
    return await Cart.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await Cart.findByIdAndDelete(id);
  }
}

module.exports = new CartRepository();
