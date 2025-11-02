const { request, response } = require('express');
const service = require('../../service/order/order.service.js');
const { ensureOwnerAdmin, isAdmin } = require('../../utils/access.js');

const ordersGet = async (req = request, res = response) => {
    try {
        const query = isAdmin(req.user) ? req.query : { ...req.query, userId: req.user._id };
        const orders = await service.getOrders(query);
        return res.status(200).json({ msg: 'Orders fetched', data: orders });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const orderGet = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ msg: 'Missing ID' });
        const order = await service.getOrderById(id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        const isOwner = order.userId?.toString() === req.user?._id?.toString();
        const isAdm = req.user?.profile?.name === 'admin';
        if (!isOwner && !isAdm) return res.status(403).json({ msg: 'Forbidden: you cannot access this order' });
        return res.status(200).json({ msg: 'Order fetched', data: order });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const orderPost = async (req = request, res = response) => {
    try {
        const created = await service.addOrder({ ...req.body, userId: req.user._id });
        return res.status(201).json({ msg: 'Order created', data: created });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const orderPut = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ msg: 'Missing ID' });
        const current = await service.getOrderById(id);
        if (!current) return res.status(404).json({ msg: 'Order not found' });
        if (!ensureOwnerAdmin(res, current.userId, req.user)) return;
        const updated = await service.updateOrder(id, req.body);
        return res.status(200).json({ msg: 'Order updated', data: updated });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const orderDel = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ msg: 'Missing ID' });
        const current = await service.getOrderById(id);
        if (!current) return res.status(404).json({ msg: 'Order not found' });
        if (!ensureOwnerAdmin(res, current.userId, req.user)) return;
        const deleted = await service.deleteOrder(id);
        return res.status(200).json({ msg: 'Order deleted', data: deleted });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

module.exports = {
    ordersGet,
    orderGet,
    orderPost,
    orderPut,
    orderDel
};
