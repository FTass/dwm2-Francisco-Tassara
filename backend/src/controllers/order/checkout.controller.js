// POST /api/orders/checkout
const mongoose  = require('mongoose');
const Cart      = require('../../../database/models/order/Cart.js');
const CartItem  = require('../../../database/models/order/CartItem.js');
const Order     = require('../../../database/models/order/Order.js');
const OrderItem = require('../../../database/models/order/OrderItem.js');
const Product   = require('../../../database/models/product/Product.js');


const checkout = async (req, res) => {
  let session = null;
  try { session = await mongoose.startSession(); } catch {}
  const useTx = !!session;
  if (useTx) session.startTransaction();

  try {
    const { userId, addressId } = req.body;
    if (!userId || !addressId) {
      throw new Error('Missing userId or addressId');
    }

    const cart = await Cart.findOne({ userId }).select('_id').session(session || undefined);
    if (!cart) throw new Error('Cart not found');

    const items = await CartItem.find({ cartId: cart._id })
      .populate({ path: 'productId', select: 'price name stock' })
      .session(session || undefined);

    if (!items.length) throw new Error('Cart is empty');

    for (const it of items) {
      if (it.productId?.stock != null && it.productId.stock < it.quantity) {
        throw new Error(`Not enough stock for product: ${it.productId?.name}`);
      }
    }

    const subTotal = items.reduce((acc, it) => acc + it.productId.price * it.quantity, 0);
    const tax   = Math.round(subTotal * 0.19); 
    const total = subTotal + tax;

    const [order] = await Order.create([{
      orderNumber: `ORD-${Date.now()}`,
      userId, addressId,
      status: 'pending_payment',
      subTotal, tax, total
    }], session ? { session } : {});

    const orderItems = items.map(it => ({
      orderId: order._id,
      productId: it.productId._id,
      quantity: it.quantity,
      unitPrice: it.productId.price,
      subTotal: it.productId.price * it.quantity
    }));
    await OrderItem.insertMany(orderItems, session ? { session } : {});

    for (const it of items) {
      await Product.updateOne(
        { _id: it.productId._id },
        { $inc: { stock: -it.quantity } },
        session ? { session } : {}
      );
    }

    await CartItem.deleteMany({ cartId: cart._id }).session(session || undefined);

    if (useTx) {
      await session.commitTransaction();
      session.endSession();
    }

    
    const full = await Order.findById(order._id)
      .populate({ path: 'userId', select: 'firstName' })
      .populate({ path: 'addressId', select: 'street firstName name' });

    const itemsOut = await OrderItem.find({ orderId: order._id })
      .populate({ path: 'productId', select: 'name price' });

    return res.status(201).json({ msg: 'Order created', data: { ...full.toObject(), items: itemsOut } });

  } catch (err) {
    if (useTx) {
      await session.abortTransaction();
      session.endSession();
    }
    return res.status(400).json({ msg: err.message });
  }
};

module.exports = { checkout };