const { Router } = require('express');
const { ordersGet, orderGet, orderPost, orderPut, orderDel } = require('../../controllers/order/order.controller.js');
const { itemsGet, itemPost, itemPut, itemDel } = require('../../controllers/order/orderItem.controller.js');
const { shippingsGet, shippingPut, shippingDel } = require('../../controllers/order/shipping.controller.js');
const { paymentsGet, paymentGet, paymentVerify, paymentRefund } = require('../../controllers/order/payment.controller.js');

const requireAuth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/authorize');
const { checkout } = require('../../controllers/order/checkout.controller.js');

const router = Router();

router.use(requireAuth);

// Orders
router.get("/", ordersGet );
router.get("/:id", orderGet );
router.post("/", orderPost );  // Crea Order + Payment + Shipping automáticamente
router.put("/:id", orderPut );
router.delete("/:id", orderDel );

// Order Items
router.get("/:orderId/items",  itemsGet );
router.post("/:orderId/items", itemPost );
router.put("/:orderId/items/:itemId", itemPut );
router.delete("/:orderId/items/:itemId", itemDel );

// Shipping (se crea automáticamente, solo GET/PUT/DELETE)
router.get("/:orderId/shipping", shippingsGet );
router.put("/:orderId/shipping/:shippingId", shippingPut );  // Actualizar carrier, tracking, etc.
router.delete("/:orderId/shipping/:shippingId", shippingDel );

// Payments (GET/VERIFY/REFUND, POST es automático)
router.get('/:orderId/payments', paymentsGet );
router.get('/:orderId/payments/:paymentId', paymentGet );
router.post('/:orderId/payments/:paymentId/verify', paymentVerify );
router.post('/:orderId/payments/:paymentId/refund', paymentRefund );

router.post('/checkout', checkout);

// router.get('/:orderId/receipt')

module.exports = router;