const { Router } = require('express');

const router = Router();

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

router.post("/", categoryPost );

router.put("/:categoryId", categoryPut );

router.delete("/:categoryId", categoryDel );


// Obtener subcategorías de una categoría padre
router.get('/:categoryId/subcategories', subcategoriesGet );

// Obtener cantdad de productos (método del modelo)
router.get('/:categoryId/product-count', getProductCount );

module.exports = router;