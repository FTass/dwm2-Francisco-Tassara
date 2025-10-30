const StockMovement = require('../../models/product/StockMovement.js')

class StockMovement_repo {
    async createMovement ( input ) {
        const movement = new StockMovement( { ...input, createdAt :  new Date() } );
        await movement.save();
        return movement;
    }

    // Todos los movimientos de un producto
    async getMovementsByProduct ( productId ) {
        return await StockMovement.find({ productId });
    }
    
    async getMovementsByUser ( userId ) {
        return await StockMovement.find( { userId } );
    }

    async getMovementByIdAndProduct( movementId, productId ) {
        const movement = await StockMovement.findOne( { _id : movementId, productId } );
        return movement || null;
    }
    
    async getMovementByIdAndUser( movementId, userId ) {
        const movement = await StockMovement.findOne( { _id : movementId, userId } );
        return movement || null;
    }

    async updateProductMovement ( movementId, productId, input) {
        const movement = await StockMovement.findOneAndUpdate(
            { _id : movementId, productId },
            input,
            { new : true, runValidators : true}
        )
        return movement || null;
    }

    async deleteMovementForProduct ( movementId, productId ) {
        const result = await StockMovement.deleteOne( { _id : movementId, productId  } );
        return result.deletedCount === 1;
    }

}