const { Router } = require('express');

const router = Router();

const requireAuth = require('../../middlewares/auth.js')
const requireRole = require('../../middlewares/authorize.js')


const {
    getProductCount,
    categoriesGet,
    categoryDel,
    categoryPost,
    categoryPut,
    subcategoriesGet,
    categoryGet
} = require('../../controllers/product/category.controller.js')

router.get('/', categoriesGet );

router.get("/:categoryId", categoryGet );

router.get("/:slug",  categoryGet );

router.post("/",  requireAuth, requireRole('admin'), categoryPost );

router.put("/:categoryId", requireAuth, requireRole('admin'), categoryPut );

router.delete("/:categoryId", requireAuth, requireRole('admin'), categoryDel );


// Obtener subcategorías de una categoría padre
router.get('/:categoryId/subcategories', subcategoriesGet );

// Obtener cantdad de productos (método del modelo)
router.get('/:categoryId/product-count', getProductCount );

module.exports = router;