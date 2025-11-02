// src/service/order/orderItem.service.js
const repo = require('../../../database/repo/order/orderItem_repo.js');
const { recalcOrderTotals } = require('./recalcTotals');

class OrderItemService {
  async addItem(orderId, data) {
    if (!orderId) {
      const e = new Error('Missing orderId');
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
    if (typeof data.unitPrice !== 'number' || data.unitPrice < 0) {
      const e = new Error('Invalid unitPrice');
      e.status = 400;
      throw e;
    }

    const payload = {
      orderId,
      productId: data.productId,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      subTotal: Number((data.quantity * data.unitPrice).toFixed(2)),
      orderNumber: data.orderNumber, // opcional si lo manejas
    };

    const created = await repo.create(payload);
    await recalcOrderTotals(orderId);
    return created;
  }

  async getItems(orderId) {
    if (!orderId) {
      const e = new Error('Missing orderId');
      e.status = 400;
      throw e;
    }
    return await repo.findByOrder(orderId);
  }

  async getItem(orderId, itemId) {
    const item = await repo.findById(itemId);
    if (!item) {
      const e = new Error('Order item not found');
      e.status = 404;
      throw e;
    }
    if (String(item.orderId) !== String(orderId)) {
      const e = new Error('Order mismatch');
      e.status = 409;
      throw e;
    }
    return item;
  }

  async updateItem(orderId, itemId, data) {
    const current = await this.getItem(orderId, itemId);
    const next = { ...data };

    const q = typeof data.quantity === 'number' ? data.quantity : current.quantity;
    const p = typeof data.unitPrice === 'number' ? data.unitPrice : current.unitPrice;

    if (data.quantity != null || data.unitPrice != null) {
      next.subTotal = Number((q * p).toFixed(2));
    }

    const updated = await repo.updateById(itemId, next);
    if (!updated) {
      const e = new Error('Order item not found');
      e.status = 404;
      throw e;
    }

    await recalcOrderTotals(orderId);
    return updated;
  }

  async deleteItem(orderId, itemId) {
    await this.getItem(orderId, itemId); // valida orden y existencia
    await repo.deleteById(itemId);
    await recalcOrderTotals(orderId);
    return true;
  }
}

module.exports = new OrderItemService();
