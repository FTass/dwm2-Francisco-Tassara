const OrderItem = require('../../models/order/OrderItem.js');

class OrderItemRepository {
    async create(data) {
        data.createdAt = new Date();
        return await OrderItem.create(data);
    }

    async findById(id) {
        return await OrderItem.findById(id);
    }

    async findByOrder(orderId) {
        return await OrderItem.find({ orderId }).sort({ createdAt: -1 });
    }

    async updateById(id, data) {
        return await OrderItem.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await OrderItem.findByIdAndDelete(id);
    }
}

module.exports = new OrderItemRepository();
