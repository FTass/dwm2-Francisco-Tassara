const repo = require("../../../database/repo/order/shipping_repo.js");

class ShippingService {
  
  // Se crea automáticamente en order.service, esta es para actualizar luego
  async updateShippingStatus(orderId, shippingId, data) {
    if (!orderId) {
      const e = new Error("Missing orderId");
      e.status = 400;
      throw e;
    }
    if (!shippingId) {
      const e = new Error("Missing shippingId");
      e.status = 400;
      throw e;
    }

    // Validar que el shipping pertenece a esta orden
    const shipping = await repo.findById(shippingId);
    if (!shipping) {
      const e = new Error("Shipping not found");
      e.status = 404;
      throw e;
    }
    if (String(shipping.orderId) !== String(orderId)) {
      const e = new Error("Order mismatch");
      e.status = 409;
      throw e;
    }

    // Actualizar con los datos: carrier, trackingNumber, status, etc.
    const updated = await repo.updateById(shippingId, data);
    return updated;
  }

  async getShippingByOrder(orderId) {
    if (!orderId) {
      const e = new Error("Missing orderId");
      e.status = 400;
      throw e;
    }
    return await repo.findByOrder(orderId);
  }

  async getShipping(orderId, shippingId) {
    const shipping = await repo.findById(shippingId);
    if (!shipping) {
      const e = new Error("Shipping not found");
      e.status = 404;
      throw e;
    }
    if (String(shipping.orderId) !== String(orderId)) {
      const e = new Error("Order mismatch");
      e.status = 409;
      throw e;
    }
    return shipping;
  }

  async deleteShipping(orderId, shippingId) {
    await this.getShipping(orderId, shippingId);
    return await repo.deleteById(shippingId);
  }
}

module.exports = new ShippingService();
