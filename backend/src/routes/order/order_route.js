const { Router } = require('express');
const { ordersGet, orderGet, orderPost, orderPut, orderDel } = require('../../controllers/order/order.controller');


const router = Router();

router.get("/", ordersGet );

router.get("/:id", orderGet );

router.post("/", orderPost );

router.put("/:id", orderPut );

router.delete("/:id", orderDel );

// Order Items

router.get("/:orderId/items",    );

router.post("/:orderId/items",   );

router.put("/:orderId/items/:itemId",  );

router.delete("/:orderId/items/:itemId",   );

// Order shipping

router.get("/:orderId/shipping",    );

router.post("/:orderId/shipping",   );

router.put("/:orderId/shipping/:shippingId",  );

router.delete("/:orderId/shipping/:shippingId",   );

// Payments 

router.get('/:orderId/payments',                   );

router.get('/:orderId/payments/:paymentId',        );

router.post('/:orderId/payments',                 );

router.post('/:orderId/payments/:paymentId/verify',);

router.post('/:orderId/payments/:paymentId/refund',);

module.exports = router;