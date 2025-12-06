const Shipping = require('../../models/order/Shipping.js');

class ShippingRepository {
    async create(data) {
        data.createdAt = new Date();
        return await Shipping.create(data);
    }

    async findById(id) {
        return await Shipping.findById(id).populate('orderId', 'orderNumber');
    }

    async findByOrder(orderId) {
        return await Shipping.find({ orderId }).sort({ createdAt: -1 });
    }

    async updateById(id, data) {
        return await Shipping.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await Shipping.findByIdAndDelete(id);
    }
}

module.exports = new ShippingRepository();
