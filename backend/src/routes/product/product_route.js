const { Router } = require('express');

const router = Router();

const {
    productDel,
    productGet,
    productGetById,
    productPost,
    productPut
} = require('../../controllers/product/product.controller.js')

router.post("/",  productPost );

router.get('/', productGet);

router.get("/:productId", productGetById );

router.put("/:productId", productPut );

router.delete("/:productId", productDel );

// // Imagenes de producto

// router.get('/:productId/images', );

// router.post("/:productId/images",    );

// router.put("/:productId/images/:imageId",  );

// router.delete("/:productId/images/:imageId",   );

// // Stock

// router.get('/:productId/stock-movement', );

// router.post("/:productId/stock-movement",    );

// router.put("/:productId/stock-movement/:movementId",  );

// router.delete("/:productId/stock-movement/:movementId",   );

// module.exports = router;