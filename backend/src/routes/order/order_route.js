const { Router } = require('express');
const { ordersGet, orderGet, orderPost, orderPut, orderDel } = require('../../controllers/order/order.controller.js');
const { itemsGet, itemPost, itemPut, itemDel } = require('../../controllers/order/orderItem.controller.js');
const { shippingsGet, shippingPost, shippingPut, shippingDel } = require('../../controllers/order/shipping.controller.js');
const { paymentsGet, paymentGet, paymentPost, paymentVerify, paymentRefund } = require('../../controllers/order/payment.controller.js');

const requireAuth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/authorize');

const router = Router();

router.use(requireAuth);

router.get("/", ordersGet );

router.get("/:id", orderGet );

router.post("/", orderPost );

router.put("/:id", orderPut );

router.delete("/:id", orderDel );

// Order Items

router.get("/:orderId/items",  itemsGet );

router.post("/:orderId/items", itemPost );

router.put("/:orderId/items/:itemId", itemPut );

router.delete("/:orderId/items/:itemId", itemDel );

// Order shipping

router.get("/:orderId/shipping", shippingsGet );

router.post("/:orderId/shipping", shippingPost );

router.put("/:orderId/shipping/:shippingId", shippingPut );

router.delete("/:orderId/shipping/:shippingId", shippingDel  );

// Payments 

router.get('/:orderId/payments', paymentsGet );

router.get('/:orderId/payments/:paymentId',     paymentGet   );

router.post('/:orderId/payments',       paymentPost          );

router.post('/:orderId/payments/:paymentId/verify',  paymentVerify );

router.post('/:orderId/payments/:paymentId/refund',  paymentRefund );

module.exports = router;