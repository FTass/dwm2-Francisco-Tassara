const { Router } = require('express');
const { cartsGet, cartGet, cartPost, cartPut, cartDel } = require('../../controllers/order/cart.controller.js');


const router = Router();

router.get('/', cartsGet );

router.get("/:cartId", cartGet );

router.post("/",  cartPost );

router.put("/:cartId", cartPut );

router.delete("/:cartId", cartDel );

// Items del carrito

router.get('/:cartId/items', );

router.post("/:cartId/items",    );

router.put("/:cartId/items/:itemId",  );

router.delete("/:cartId/items/:itemId",   );


module.exports = router;