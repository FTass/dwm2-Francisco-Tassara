const { request, response } = require('express');

const  {
    delMovementForProduct,
    updMovementForProduct,
    getMovementIdUser,
    getUserMovements,
    getProductMovements,
    addMovement,
    getMovementIdProduct
} = require('../../service/product/stockMovement.service.js');

// Crear un movimiento para un producto

const movementPost = async (req, res) => {

    try {
        const { productId } = req.params;
        const { userId, type, quantity, ...rest } = req.body || {};

        if (!productId) return res.status( 400 ).json({ msg: 'Missing product ID' });
        if (!userId)    return res.status( 400 ).json({ msg: 'Missing userId' });
        if (!type || !['entry','exit','ad'].includes(type)) return res.status( 400 ).json({ msg: 'Invalid type' });
        if (!Number.isFinite(quantity) || quantity <= 0)
        return res.status( 400 ).json({ msg: 'Invalid quantity' });

        const newMovement = await addMovement({ productId, userId, type, quantity, ...rest });
        return res.status(201).json({ msg: 'Movement created', data: newMovement });
    } catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
    }
};

// Obtener un movimiento por { productId, movementId }

const movementGetById = async ( req = request, res = response) => {
    try {
        const { movementId, productId } = req.params;
        if ( !movementId || !productId) return res.status( 400 ).json( { msg : 'Missing required IDs' } );
        const movement = await getMovementIdProduct ( movementId, productId );
        if ( !movement ) return res.status( 404 ).json( { msg : 'Movement not found' } );
        return res.status( 200 ).json( { msg : 'Movement fetched', data : movement } );
    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});
    }
}

// Obtener todos los movimientos de un producto

const movementsGetByProduct = async ( req = request, res = response) => {
    try {
        const { productId } = req.params;
        if ( !productId ) return res.status( 400 ).json( { msg : 'Missing product ID' } );
        const movements = await getProductMovements( productId );
        return res.status( 200 ).json( { msg : 'Movements fetched', data : movements } )

    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});
    }
}

// Actualizar un movimiento por { productId, movementId }


const movementPutByProductId = async ( req = request, res = response) => {
    try {
        const { movementId, productId } = req.params;
        const body = req.body;
        if( Object.keys(body).length === 0 ) return res.status(400).json( {msg: 'Missing required data' } );
        if ( !movementId || !productId) return res.status( 400 ).json( { msg : 'Missing required IDs' } );
        const updatedMovement = await updMovementForProduct( movementId, productId, body );
        if ( !updatedMovement ) return res.status( 404 ).json( { msg : 'Movement not found' } );
        return res.status( 200 ).json( { msg : 'Movement updated successfully', data : updatedMovement} );
    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});
    }
}

// Eliminar un movimiento por { productId, movementId }

const movementDelByProductId = async ( req = request, res = response) => {
    try {
        const { movementId, productId } = req.params;
        if ( !movementId || !productId) return res.status( 400 ).json( { msg : 'Missing required IDs' } );

        const success = await delMovementForProduct ( movementId, productId );
        if ( !success ) return res.status( 404 ).json( { msg : 'Movement not found or not deleted' } );
        return res.status( 204 ).send();
    } catch ( error ) {
        console.log( error );
        return res.status(error.status || 500).json({msg: error.message || 'Server error'});
    }
}

module.exports = {
    movementDelByProductId,
    movementGetById,
    movementPost,
    movementPutByProductId,
    movementsGetByProduct
}