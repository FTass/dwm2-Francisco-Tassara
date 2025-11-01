const { request, response } = require('express');
const service = require('../../service/order/orderItem.service.js');

const itemsGet = async (req = request, res = response) => {
    try {
        const { orderId } = req.params;
        const items = await service.getItems(orderId);
        return res.status(200).json({ msg: 'Order items fetched', data: items });
    } catch ( error ) {
        return res.status(error.status || 500).json( { msg: error.message || 'Server error' } );
    }
};

const itemPost = async (req = request, res = response) => {
    try {
        const { orderId } = req.params;
        const created = await service.addItem(orderId, req.body);
        return res.status(201).json({ msg: 'Order item created', data: created });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const itemPut = async (req = request, res = response) => {
    try {
        const { orderId, itemId } = req.params;
        const updated = await service.updateItem(orderId, itemId, req.body);
        return res.status(200).json({ msg: 'Order item updated', data: updated });
    } catch (error) {
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const itemDel = async (req = request, res = response) => {
    try {
        const { orderId, itemId } = req.params;
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
    itemDel,
};
