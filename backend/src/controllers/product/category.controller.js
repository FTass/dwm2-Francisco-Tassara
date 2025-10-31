const { request, response } = require('express');
const service = require('../../service/product/category.service.js');

const categoriesGet = async ( req = request, res = response) => {
    try {
        const { name } = req.query;

        if ( name ) {
            const category = await service.getCategoryByName( name );
            if ( !category ) return res.status( 404 ).json( { msg : 'Category not found' } );
            return res.status( 200 ).json( { msg : 'Category fetched', data : category } );
        }
        const categories = await service.getCategories();
        return res.status( 200 ).json( { msg : 'Categories fetched', data : categories } );
    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});
    }
}
const categoryGet = async (req = request, res = response) => {
    try {
        const { categoryId, slug } = req.params;

        if (!categoryId && !slug) {
            return res.status( 400 ).json({ msg: 'Missing ID or Slug' });
        }
        if (categoryId && slug) {
            return res.status( 400 ).json({ msg: 'Provide either ID or Slug, not both' });
        }

        
        if (slug) {
            const category = await service.getCategoryBySlug(slug);
            if( !category ) return res.status( 404 ).json( { msg : 'Category not found' } );

            return res.status( 200 ).json({ msg: 'Category fetched', data: category });
        }
      
        const category = await service.getCategoryById(categoryId);
        if( !category ) return res.status( 404 ).json( { msg : 'Category not found' } );
        return res.status( 200 ).json({ msg: 'Category fetched', data: category });

    } catch (error) {
        console.log(error);

  
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

const categoryPost = async ( req = request, res = response) => {
    try {
        const body = req.body || {};
        if ( Object.keys(body).length === 0 ) return res.status(400).json({msg: 'No data provided'});
        const newCategory = await service.addCategory( body );
        return res.status( 201 ).json( { msg : 'Category created', data : newCategory } )

    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});
    }
}
const categoryPut = async ( req = request, res = response) => {
    try {
        const { categoryId } = req.params;
        if ( !categoryId ) return res.status( 400 ).json( { msg:'Missing category ID' } )
        const body = req.body || {};
        if ( Object.keys(body).length === 0 ) return res.status(400).json({msg: 'No data provided'});
        const updatedCategory = await service.updCategory( categoryId, body );
        if ( !updatedCategory ) return res.status( 404 ).json( { msg : 'Category not found' } )
        return res.status( 200 ).json( { msg: 'Category updated', data : updatedCategory } );
    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});
    }
}
const categoryDel = async ( req = request, res = response) => {
    try {
        const { categoryId } = req.params;
        if ( !categoryId ) return res.status( 400 ).json( { msg:'Missing category ID' } )
        const success = await service.delCategory( categoryId );

        if ( !success ) return res.status( 404 ).json( { msg : 'Category not found' } );

        return res.status( 204 ).send();

    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});
    }
}

const subcategoriesGet = async ( req = request, res = response) => {
    try {
        const { categoryId } = req.params;
        if ( !categoryId ) return res.status( 400 ).json( { msg:'Missing category ID' } )
        
        const subCategories = await service.getSubCategories( categoryId );
        return res.status( 200 ).json( { msg : 'Sub-Categories fetched', data : subCategories } );
    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});
    }
}

const getProductCount = async (req = request, res = response) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) return res.status(400).json({ msg: 'Category ID is required' });

        const count = await service.getProductCount(categoryId);
        return res.status(200).json({ msg: 'Product count fetched', data: { count } });
    } catch (error) {
        console.error(error);
    
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('not found') || msg.includes('category')) {
            return res.status(404).json({ msg: error.message || 'Category not found' });
        }
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};


module.exports = {
    getProductCount,
    categoriesGet,
    categoryDel,
    categoryPost,
    categoryPut,
    subcategoriesGet,
    categoryGet
}