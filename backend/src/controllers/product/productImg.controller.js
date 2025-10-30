const { request, response } = require ('express');
const  {
    addImg,
    getImg,
    getProductImgs,
    updImg,
    delImg,
    setPrimary
} = require ('../../service/product/productImg.service.js')


const imagesGet = async ( req = request, res= response ) => {
    try {
        const { productId } = req.params;
        if ( !productId ) return res.status( 400 ).json( { msg : 'Missing product ID' } );
        const images = await getProductImgs ( productId )
        return res.status( 200 ).json( { msg: 'Images Fetched', data : images } );
    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});

    }
}
const imageGetById = async ( req = request, res= response ) => {
    try {
        const { imageId, productId } = req.params;
        if ( !imageId || !productId) return res.status( 400 ).json( { msg : 'Missing required IDs' } );
        const image = await getImg( imageId, productId );
        if ( !image ) return res.status(404).json({ msg: 'Image not found' });

        return res.status( 200 ).json( { msg : 'Image fetched', data : image } );
    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});

    }
}

const  imagesPost = async ( req = request, res= response ) => {
    try {
        const { productId } = req.params;
        const body = req.body;
        if( Object.keys(body).length === 0 ) return res.status(400).json({msg: 'Missing required data'});
        if ( !productId ) return res.status( 400 ).json( { msg : 'Missing product ID' } );
        const newImage = await addImg ( { ...body, productId } );

        return res.status( 201 ).json( { msg : 'Image created ', data : newImage } );

    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});

    }
}
const  imagesPut = async ( req = request, res= response ) => {
    try {
        const { imageId, productId } = req.params;
        const body = req.body;
        
        if( Object.keys(body).length === 0 ) return res.status(400).json({msg: 'Missing required data'});
        if ( !imageId || !productId) return res.status( 400 ).json( { msg : 'Missing required IDs' } );

        if (Object.keys(body).length === 1 && body.isPrimary === true) {
            const primaryImg = await setPrimary( imageId, productId );
            return res.status( 200 ).json({
                message: 'Primary image updated successfully',
                image: primaryImg,
            });
        }

        const updatedImg = await updImg ( imageId, productId, body );
        return res.status( 200 ).json( { msg: 'Img Updated', data : updatedImg  } );
    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});

    }
}
const  imagesDel = async ( req = request, res= response ) => {
    try {
        const { imageId, productId } = req.params;
        if ( !imageId || !productId) return res.status( 400 ).json( { msg : 'Missing required IDs' } );
        const success = await delImg ( imageId, productId );
        if ( !success ) return res.status( 404 ).json( { msg: 'Image not found or not deleted' } );
        return res.status( 204 ).send()
    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});

    }
}

module.exports = {
    imageGetById,
    imagesDel,
    imagesGet,
    imagesPost,
    imagesPut
}