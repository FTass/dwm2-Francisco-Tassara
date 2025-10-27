const { Router } = require('express');


const router = Router();

router.get('/', );

router.get("/:id",    );

router.post("/",    );

router.put("/:id",  );

router.delete("/:id",   );

// Items del carrito

router.get('/:cartId/items', );

router.post("/:cartId/items",    );

router.put("/:cartId/items/:itemId",  );

router.delete("/:cartId/items/:itemId",   );


module.exports = router;