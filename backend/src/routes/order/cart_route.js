const { Router } = require('express');
const { cartsGet, cartGet, cartPost, cartPut, cartDel } = require('../../controllers/order/cart.controller.js');
const { cartItemGet, cartItemsGet, cartItemPost, cartItemPut, cartItemDel } = require('../../controllers/order/cartItem.controller.js');

const requireAuth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/authorize');

const router = Router();

router.use(requireAuth);

router.get('/', cartsGet );

router.get("/:cartId", cartGet );

router.post("/",  cartPost );

router.put("/:cartId", cartPut );

router.delete("/:cartId", cartDel );

// Items del carrito

router.get('/:cartId/items', cartItemsGet );

router.get('/:cartId/items/:itemId', cartItemGet)

router.post("/:cartId/items",  cartItemPost);

router.put("/:cartId/items/:itemId", cartItemPut  );

router.delete("/:cartId/items/:itemId",  cartItemDel );


module.exports = router;