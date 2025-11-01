const Order = require('../../models/order/Order.js');



class OrderRepository {
    async create( input ) {
        const now = new Date();
        input.createdAt = now;
        input.updatedAt = now;
        return await Order.create( input );
    }

    async findById( orderId ) {
        return await Order.findById( orderId );
    }

    async findByNumber( orderNumber ) {
        return await Order.findOne({ orderNumber });
    }

    async findAll(filter = {}, options = {}) {
        const { limit = 50, page = 1, sort = { createdAt: -1 } } = options;
        return await Order.find( filter ).sort( sort ).limit( limit ).skip(( page - 1 ) * limit );
    }

    async updateById( orderId, input ) {
        input.updatedAt = new Date();
        return await Order.findByIdAndUpdate( orderId, input, { new: true } );
    }

    async deleteById( orderId ) {
        return await Order.findByIdAndDelete( orderId );
    }
}

module.exports = new OrderRepository();
