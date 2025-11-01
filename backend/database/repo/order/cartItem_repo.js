const CartItem = require('../../models/order/CartItem.js');

class CartItemRepository {
  async create(data) {
    data.addedAt = new Date();
    return await CartItem.create(data);
  }

  async findById(id) {
    return await CartItem.findById(id);
  }

  async findByCart(cartId) {
    return await CartItem.find({ cartId }).sort({ addedAt: -1 });
  }

  async updateById(id, data) {
    return await CartItem.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id) {
    return await CartItem.findByIdAndDelete(id);
  }
}

module.exports = new CartItemRepository();
