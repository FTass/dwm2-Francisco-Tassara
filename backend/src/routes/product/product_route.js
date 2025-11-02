const { Router } = require('express');

const router = Router();

const requireAuth = require('../../middlewares/auth.js')
const requireRole = require('../../middlewares/authorize.js')


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

} = require('../../controllers/product/productImg.controller.js')

const { 
    movementDelByProductId,
    movementGetById,
    movementPost,
    movementPutByProductId,
    movementsGetByProduct
} = require('../../controllers/product/stockMovement.controller.js')


router.post("/", requireAuth, requireRole('admin'), productPost );

router.get('/',  productGet);

router.get("/:productId", productGetById );

router.put("/:productId", requireAuth, requireRole('admin'), productPut );

router.delete("/:productId", requireAuth, requireRole('admin'), productDel );

// Imagenes de producto

router.get('/:productId/images', imagesGet );

router.get("/:productId/images/:imageId", imageGetById );

router.post("/:productId/images", requireAuth, requireRole('admin'), imagesPost );

router.put("/:productId/images/:imageId", requireAuth, requireRole('admin'), imagesPut );

router.delete("/:productId/images/:imageId", requireAuth, requireRole('admin'), imagesDel );

// Stock

router.get('/:productId/stock-movement', movementsGetByProduct );

router.post("/:productId/stock-movement", requireAuth, requireRole('admin'), movementPost );

router.put("/:productId/stock-movement/:movementId",  requireAuth, requireRole('admin'), movementPutByProductId );

router.delete("/:productId/stock-movement/:movementId",  requireAuth, requireRole('admin'), movementDelByProductId );

module.exports = router;