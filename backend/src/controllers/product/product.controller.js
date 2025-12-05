const { request, response } = require('express');
const {
    addProduct,
    getById,
    getByName,
    getByMilkType,
    getByStatus,
    getAll,
    getByCategory,
    updProduct,
    deleteProduct
} = require('../../service/product/product.service.js');



const productGet = async (req = request, res = response) => {
  try {
    const { name, milkType, status, categoryId, offer, highlight, lowStock, threshold } = req.query;

    const filter = {};

    if (name) {
      filter.name = new RegExp(name, 'i'); 
    }

    if ( offer ) {
      filter.offer = offer;
    }
    
    if ( highlight ) {
      filter.highlight  = highlight;
    }
    
    if (milkType) {
      filter.milkType = milkType; 
    }

    if (status) {
      filter.status = status; 
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    // Filtrar por stock bajo
    if (lowStock === 'true') {
      const stockThreshold = parseInt(threshold) || 50;
      filter.stock = { $lt: stockThreshold };
    }

    const products = await getAll(filter);

    return res.status(200).json({
      msg: 'Products retrieved successfully',
      data: products
    });
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).json({
      msg: error.message || 'Server error'
    });
  }
};
const  productGetById = async ( req = request, res = response ) => {
     try {
        const { productId } = req.params;
        if ( !productId ) return res.status( 400 ).json({ msg: 'Missing product ID'});
        
        const product = await getById( productId );
    
        if ( !product ) return res.status( 404 ).json( {msg: 'Product Not Found'} )
        return res.status( 200 ).json( { msg: 'Product fetched', data: product } )

    } catch ( error ) {
        console.log( error );
        return res.status( error.status || 500 ).json({msg: error.message || 'Server error'});
    }
}


const productPost = async ( req = request, res = response ) => {
    try {
        const body = req.body || {};

        if ( Object.keys(body).length === 0 ) return res.status(400).json({msg: 'No data provided'});

        const newProduct = await addProduct( body );
        return res.status( 201 ).json( { msg: 'Product created', data: newProduct } );
        
    } catch ( error) {
        console.log( error );
        return res.status( error.status || 500 ).json({msg: error.message || 'Server error'});
    }
}
const productPut = async ( req = request, res = response ) => {
    try {
        const { productId } = req.params;
        const body = req.body || {};
        
        if ( !productId ) return res.status( 400 ).json( { msg: 'Missing product ID' } );
        
        if ( Object.keys(body).length === 0 ) return res.status(400).json({msg: 'No data provided'});
        
        const updatedProduct = await updProduct( productId, body );

        return res.status(200).json({msg: 'Product updated', data: updatedProduct})

    } catch ( error ) {
        console.log( error );
        return res.status( error.status || 500 ).json({msg: error.message || 'Server error'});
    }
}
const productDel = async ( req = request, res = response ) => {
    try {
        const { productId } = req.params;
        if ( !productId ) return res.status( 400 ).json({ msg: 'Missing product ID'});

        const success = await deleteProduct( productId );
        if ( !success ) return res.status( 404 ).json({ msg: 'Product not found or not deleted'});
        return res.status(204).send()
    }catch ( error ) {
        console.log( error );
        return res.status( error.status || 500 ).json({msg: error.message || 'Server error'});
    }
}

module.exports = {
    productDel,
    productGet,
    productGetById,
    productPost,
    productPut
}