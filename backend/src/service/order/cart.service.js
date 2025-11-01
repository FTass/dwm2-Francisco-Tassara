const repo = require('../../../database/repo/order/cart_repo.js');

class CartService {
  async addCart(data) {
    if (!data.userId) {
      const e = new Error('Missing userId');
      e.status = 400;
      throw e;
    }
    const existing = await repo.findByUser(data.userId);
    if (existing) {
      const e = new Error('User already has a cart');
      e.status = 409;
      throw e;
    }
    return await repo.create(data);
  }

  async getCarts(query = {}) {
    const { userId } = query;
    const filter = {};
    if (userId) filter.userId = userId;
    return await repo.findAll(filter);
  }

  async getCartById(id) {
    const cart = await repo.findById(id);
    if (!cart) {
      const e = new Error('Cart not found');
      e.status = 404;
      throw e;
    }
    return cart;
  }

  async updateCart(id, data) {
    const updated = await repo.updateById(id, data);
    if (!updated) {
      const e = new Error('Cart not found');
      e.status = 404;
      throw e;
    }
    return updated;
  }

  async deleteCart(id) {
    const deleted = await repo.deleteById(id);
    if (!deleted) {
      const e = new Error('Cart not found');
      e.status = 404;
      throw e;
    }
    return deleted;
  }
}

module.exports = new CartService();
