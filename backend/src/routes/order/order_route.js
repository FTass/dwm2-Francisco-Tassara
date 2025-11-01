const { Router } = require('express');
const { ordersGet, orderGet, orderPost, orderPut, orderDel } = require('../../controllers/order/order.controller.js');
const { itemsGet, itemPost, itemPut, itemDel } = require('../../controllers/order/orderItem.controller.js');
const { shippingsGet, shippingPost, shippingPut, shippingDel } = require('../../controllers/order/shipping.controller.js');


const router = Router();

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

router.get('/:orderId/payments',                   );

router.get('/:orderId/payments/:paymentId',        );

router.post('/:orderId/payments',                 );

router.post('/:orderId/payments/:paymentId/verify',);

router.post('/:orderId/payments/:paymentId/refund',);

module.exports = router;