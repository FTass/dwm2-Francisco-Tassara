const repo = require('../../../database/repo/order/cartItem_repo.js');

class CartItemService {
  async addItem(cartId, data) {
    if (!cartId) {
      const e = new Error('Missing cartId');
      e.status = 400;
      throw e;
    }
    if (!data.productId) {
      const e = new Error('Missing productId');
      e.status = 400;
      throw e;
    }
    if (typeof data.quantity !== 'number' || data.quantity <= 0) {
      const e = new Error('Invalid quantity');
      e.status = 400;
      throw e;
    }
    const payload = {
      cartId,
      productId: data.productId,
      quantity: data.quantity,
    };
    return await repo.create(payload);
  }

  async getItems(cartId) {
    if (!cartId) {
      const e = new Error('Missing cartId');
      e.status = 400;
      throw e;
    }
    return await repo.findByCart(cartId);
  }

  async getItem(cartId, itemId) {
    const item = await repo.findById(itemId);
    if (!item) {
      const e = new Error('Cart item not found');
      e.status = 404;
      throw e;
    }
    if (String(item.cartId) !== String(cartId)) {
      const e = new Error('Cart mismatch');
      e.status = 409;
      throw e;
    }
    return item;
  }

  async updateItem(cartId, itemId, data) {
    const current = await this.getItem(cartId, itemId);
    const next = { ...data };
    if (typeof data.quantity === 'number' && data.quantity > 0) {
      next.quantity = data.quantity;
    } else {
      next.quantity = current.quantity;
    }
    const updated = await repo.updateById(itemId, next);
    if (!updated) {
      const e = new Error('Cart item not found');
      e.status = 404;
      throw e;
    }
    return updated;
  }

  async deleteItem(cartId, itemId) {
    await this.getItem(cartId, itemId);
    return await repo.deleteById(itemId);
  }
}

module.exports = new CartItemService();
