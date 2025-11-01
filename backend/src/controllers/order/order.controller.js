const { request, response } = require('express');
const service = require('../../service/order/order.service.js');

const ordersGet = async (req = request, res = response) => {
    try {
        const orders = await service.getOrders(req.query);
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
        return res.status(200).json({ msg: 'Order fetched', data: order });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const orderPost = async (req = request, res = response) => {
    try {
        const created = await service.addOrder(req.body);
        return res.status(201).json({ msg: 'Order created', data: created });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const orderPut = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ msg: 'Missing ID' });
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
    orderDel,
};
