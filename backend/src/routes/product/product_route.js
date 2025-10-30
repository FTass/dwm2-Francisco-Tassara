const { Router } = require('express');

const router = Router();

const {
    productDel,
    productGet,
    productGetById,
    productPost,
    productPut
} = require('../../controllers/product/product.controller.js')

const {
    imageGetById,
    imagesDel,
    imagesGet,
    imagesPost,
    imagesPut

} = require('../../controllers/product/product.controller.js')

router.post("/",  productPost );

router.get('/', productGet);

router.get("/:productId", productGetById );

router.put("/:productId", productPut );

router.delete("/:productId", productDel );

// Imagenes de producto

router.get('/:productId/images', imagesGet );

router.get("/:productId/images/:imageId", imageGetById );

router.post("/:productId/images",  imagesPost );

router.put("/:productId/images/:imageId", imagesPut );

router.delete("/:productId/images/:imageId", imagesDel );

// // Stock

// router.get('/:productId/stock-movement', );

// router.post("/:productId/stock-movement",    );

// router.put("/:productId/stock-movement/:movementId",  );

// router.delete("/:productId/stock-movement/:movementId",   );

// module.exports = router;