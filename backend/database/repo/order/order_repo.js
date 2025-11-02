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

    async findById(orderId, options = {}) {
        const { populate = [], select = null, lean = true } = options;
        let q = Order.findById(orderId);
        if (select) q = q.select(select);
        if (populate?.length) q = q.populate(populate);
        if (lean) q = q.lean();
        return await q;
  }

    async findAll(filter = {}, options = {}) {
            const {
            limit = 50,
            page = 1,
            sort = { createdAt: -1 },
            populate = [],
            select = null,
            lean = true,
        } = options;

        let q = Order.find(filter)
            .sort(sort)
            .limit(limit)
            .skip((page - 1) * limit);

        if (select) q = q.select(select);
        if (populate?.length) q = q.populate(populate);
        if (lean) q = q.lean();

        return await q;
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
