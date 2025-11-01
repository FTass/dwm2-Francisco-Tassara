const repo = require("../../../database/repo/order/shipping_repo.js");

class ShippingService {
  async addShipping(orderId, data) {
    if ( !orderId ) {
      const e = new Error("Missing orderId");
      e.status = 400;
      throw e;
    }
    if ( !data.carrier || !data.trackingNumber ) {
      const e = new Error("Missing carrier or trackingNumber");
      e.status = 400;
      throw e;
    }
    if ( !data.estimatedDelivery || !data.shippedAt ) {
      const e = new Error( "Missing dates" );
      e.status = 400;
      throw e;
    }
    const payload = {
      orderId,
      carrier: data.carrier,
      trackingNumber: data.trackingNumber,
      estimatedDelivery: new Date(data.estimatedDelivery),
      shippedAt: new Date(data.shippedAt),
      deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : null,
    };
    return await repo.create(payload );
  }

  async getShippings( orderId ) {
    if ( !orderId ) {
      const e = new Error( "Missing orderId" );
      e.status = 400;
      throw e;
    }
    return await repo.findByOrder( orderId );
  }

  async getShipping( orderId, shippingId ) {
    const shipping = await repo.findById( shippingId );
    if ( !shipping ) {
      const e = new Error( "Shipping not found" );
      e.status = 404;
      throw e;
    }
    if ( String( shipping.orderId ) !== String( orderId ) ) {
      const e = new Error("Order mismatch");
      e.status = 409;
      throw e;
    }
    return shipping;
  }

  async updateShipping( orderId, shippingId, data ) {
    await this.getShipping( orderId, shippingId );
    const updated = await repo.updateById( shippingId, data );
    if ( !updated ) {
      const e = new Error( "Shipping not found" );
      e.status = 404;
      throw e;
    }
    return updated;
  }

  async deleteShipping( orderId, shippingId ) {
    await this.getShipping( orderId, shippingId );
    return await repo.deleteById( shippingId );
  }
}

module.exports = new ShippingService();
