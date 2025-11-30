const { request, response } = require('express');
const service = require('../../service/order/shipping.service.js');
const orderService = require('../../service/order/order.service.js');
const { ensureOwnerOrAdmin, isAdmin } = require('../../utils/access.js');

const shippingsGet = async (req = request, res = response) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ msg: 'Missing orderId' });
    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    if (!ensureOwnerOrAdmin(res, order.userId, req.user)) return;
    const shippings = await service.getShippingByOrder(orderId);
    return res.status(200).json({ msg: 'Shippings fetched', data: shippings });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

// Shipping se crea automáticamente con la orden, no es necesario POST
// Pero dejamos PUT para actualizar datos de envío (carrier, tracking, etc.)

const shippingPut = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden: admin only' });
    const { orderId, shippingId } = req.params;
    const updated = await service.updateShippingStatus(orderId, shippingId, req.body);
    return res.status(200).json({ msg: 'Shipping updated', data: updated });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const shippingDel = async (req = request, res = response) => {
  try {
    if (!isAdmin(req.user)) return res.status(403).json({ msg: 'Forbidden: admin only' });
    const { orderId, shippingId } = req.params;
    const deleted = await service.deleteShipping(orderId, shippingId);
    return res.status(200).json({ msg: 'Shipping deleted', data: deleted });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

module.exports = {
  shippingsGet,
  shippingPut,
  shippingDel
};
