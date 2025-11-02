const { request, response } = require('express');
const service = require('../../service/order/orderItem.service.js');
const orderService = require('../../service/order/order.service.js');
const { ensureOwnerAdmin } = require('../../utils/access.js');

const itemsGet = async (req = request, res = response) => {
    try {
        const { orderId } = req.params;
        if (!orderId) return res.status(400).json({ msg: 'Missing orderId' });
        const order = await orderService.getOrderById(orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        if (!ensureOwnerAdmin(res, order.userId, req.user)) return;
        const items = await service.getItems(orderId);
        return res.status(200).json({ msg: 'Order items fetched', data: items });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const itemPost = async (req = request, res = response) => {
    try {
        const { orderId } = req.params;
        if (!orderId) return res.status(400).json({ msg: 'Missing orderId' });
        const order = await orderService.getOrderById(orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        if (!ensureOwnerAdmin(res, order.userId, req.user)) return;
        const created = await service.addItem(orderId, req.body);
        return res.status(201).json({ msg: 'Order item created', data: created });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const itemPut = async (req = request, res = response) => {
    try {
        const { orderId, itemId } = req.params;
        if (!orderId || !itemId) return res.status(400).json({ msg: 'Missing orderId or itemId' });
        const order = await orderService.getOrderById(orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        if (!ensureOwnerAdmin(res, order.userId, req.user)) return;
        const updated = await service.updateItem(orderId, itemId, req.body);
        return res.status(200).json({ msg: 'Order item updated', data: updated });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const itemDel = async (req = request, res = response) => {
    try {
        const { orderId, itemId } = req.params;
        if (!orderId || !itemId) return res.status(400).json({ msg: 'Missing orderId or itemId' });
        const order = await orderService.getOrderById(orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        if (!ensureOwnerAdmin(res, order.userId, req.user)) return;
        const deleted = await service.deleteItem(orderId, itemId);
        return res.status(200).json({ msg: 'Order item deleted', data: deleted });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

module.exports = {
    itemsGet,
    itemPost,
    itemPut,
    itemDel
};
