const repo = require ('../../../database/repo/product/stockMovement_repo.js');

const addMovement = async ( data ) => {
    const newMovement = await repo.createMovement( data );
    return newMovement;
}

const getMovementIdProduct = async ( movementId, productId) => {
    const movement = await repo.getMovementByIdAndProduct ( movementId, productId );
    if ( !movement ) throw new Error ( 'Movement not found' );
    return movement;
}

const getMovementIdUser = async ( movementId, userId ) => {
    const movement = await repo.getMovementByIdAndUser ( movementId, userId );
    if ( !movement ) throw new Error ( 'Movement not found' );
    return movement;
}

const getProductMovements = async ( productId ) => {
    const movements = await repo.getMovementsByProduct( productId );
    return movements || []; 
}

const getUserMovements = async ( userId ) => {
    const movements = await repo.getMovementsByUser( userId );
    return movements || [];
}

const updMovementForProduct = async ( movementId, productId, data ) => {
    const updatedMovement = await repo.updateProductMovement( movementId, productId, data);
    if ( !updatedMovement ) throw new Error ( 'Movement not found or not updated' );
    return updatedMovement;
    
}

const delMovementForProduct = async ( movementId, productId ) => {
    const success = await repo.deleteMovementForProduct ( movementId, productId );
    if ( !success ) throw new Error ( 'Movement not found or not deleted' );
    return success
}


module.exports = {
    delMovementForProduct,
    updMovementForProduct,
    getMovementIdUser,
    getUserMovements,
    getProductMovements,
    addMovement,
    getMovementIdProduct
}