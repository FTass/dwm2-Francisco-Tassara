const repo = require('../../../database/repo/order/order_repo.js');

const addOrder = async ( data ) => {
    if ( !data.orderNumber ) throw new Error('Missing orderNumber');
    if ( !data.userId ) throw new Error('Missing userId');
    if ( !data.addressId ) throw new Error('Missing addressId');
    if ( typeof data.subTotal !== 'number' ) throw new Error( 'Missing subTotal' );
    if ( typeof data.tax !== 'number' ) throw new Error ( 'Missing tax' );
    data.total = Number( ( data.subTotal + data.tax ).toFixed( 2 ) );
    data.status = data.status || 'pending_payment';
    const exists = await repo.findByNumber( data.orderNumber );
    if ( exists ) {
        const e = new Error( 'Order number already exists' );
        e.status = 409;
        throw e;
    }
    return await repo.create( data );
};

const getOrders = async ( query = {} ) => {
    const { status, userId, orderNumber, page, limit } = query;
    const filter = {};
    if ( status ) filter.status = status;
    if ( userId ) filter.userId = userId;
    if ( orderNumber ) filter.orderNumber = orderNumber;
    const options = {};
    if ( limit ) options.limit = Number( limit );
    if ( page ) options.page = Number( page );
    return await repo.findAll( filter, options );
};

const getOrderById = async ( orderId ) => {
    const order = await repo.findById( orderId );
    if (!order) {
        const e = new Error('Order not found');
        e.status = 404;
        throw e;
    }
    return order;
};

const updateOrder = async ( orderId, data ) => {
    if (data.subTotal != null || data.tax != null) {
        const current = await getOrderById( orderId );
        const sub = typeof data.subTotal === 'number' ? data.subTotal : current.subTotal;
        const tax = typeof data.tax === 'number' ? data.tax : current.tax;
        data.total = Number( ( sub + tax ).toFixed( 2 ) );
    }
    const updated = await repo.updateById( orderId, data );
    if ( !updated ) {
        const e = new Error('Order not found');
        e.status = 404;
        throw e;
    }
    return updated;
};

const deleteOrder = async ( orderId ) => {
    const deleted = await repo.deleteById( orderId );
    if ( !deleted ) {
        const e = new Error( 'Order not found' );
        e.status = 404;
        throw e;
    }
    return deleted;
};

module.exports = {
    addOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
