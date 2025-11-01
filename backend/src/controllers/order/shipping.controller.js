const { request, response } = require('express');
const service = require('../../service/order/shipping.service.js');

const shippingsGet = async (req = request, res = response) => {
  try {
    const { orderId } = req.params;
    const shippings = await service.getShippings(orderId);
    return res.status(200).json({ msg: 'Shippings fetched', data: shippings });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const shippingPost = async (req = request, res = response) => {
  try {
    const { orderId } = req.params;
    const created = await service.addShipping(orderId, req.body);
    return res.status(201).json({ msg: 'Shipping created', data: created });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const shippingPut = async (req = request, res = response) => {
  try {
    const { orderId, shippingId } = req.params;
    const updated = await service.updateShipping(orderId, shippingId, req.body);
    return res.status(200).json({ msg: 'Shipping updated', data: updated });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const shippingDel = async (req = request, res = response) => {
  try {
    const { orderId, shippingId } = req.params;
    const deleted = await service.deleteShipping(orderId, shippingId);
    return res.status(200).json({ msg: 'Shipping deleted', data: deleted });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

module.exports = {
  shippingsGet,
  shippingPost,
  shippingPut,
  shippingDel,
};
