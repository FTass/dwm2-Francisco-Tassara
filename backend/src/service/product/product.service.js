const repo = require('../../../database/repo/product/product_repo.js')


const addProduct = async ( input ) => {
    const discount = input?.discount ?? 0;

    if (input.offer && discount > 0 && discount < 100) {
        const oldPrice = input.price;
        const newPrice = oldPrice - (oldPrice * (discount / 100));
        input.oldPrice = oldPrice;
        input.price = newPrice;
    }

    const product = await repo.createProduct(input);
    return product;
}

const getById = async ( productId ) => {
    const product = await repo.getProductById( productId );
    if ( !product ) throw new Error('Product not Found');
    return product
}

const getByName = async ( productName ) => {
    const product = await repo.getProductByName( productName );
    if ( !product ) throw new Error('Product not Found');
    return product
}

// Este metodo solo aporta si son quesos
const getByMilkType = async ( milkType ) => {

    const products = await repo.getCheesesByMilkType( milkType );
    return products || [];
}

const getByStatus = async ( status ) => {
    const products = await repo.getProductsByStatus( status );
    return products || [];
}

const getAll = async (filters = {}) => {
  const products = await repo.getAllProducts(filters);
  return products;
};

const getByCategory = async ( categoryId ) => {
    const products = await repo.getProductsByCategory( categoryId );
    return products || [];
}

const updProduct = async ( productId, input ) => {
    const product = await repo.getProductById( productId );
    let payload = {...input}
    const discount = input?.discount ?? 0;

    const hasDiscount = 
        typeof input.discount === 'number'&&
        discount > 0 &&
        discount < 100;

    if ( input.offer == false ) {
        const basePrice = product.oldPrice ?? product.price;
        payload.price = basePrice
        payload.discount = 0;
        payload.offer = false;
        payload.oldPrice = undefined;
    }
    
    if (input.offer === true && hasDiscount) {
        const basePrice = product.oldPrice ?? product.price;
        const newPrice = basePrice - (basePrice * (discount / 100));
        payload.oldPrice = basePrice;
        payload.price = newPrice;
    }
    const updatedProduct = await repo.updateProduct( productId, payload );

    if ( !updatedProduct ) throw new Error('Product not found or not updated');
    return updatedProduct;
}

const deleteProduct = async ( productId ) => {
    const success = await repo.deleteProduct( productId );
    if (!success) throw new Error('Product not found or could not be deleted');
    return { success: true, message: 'Product deleted successfully' };
}

module.exports = {
    addProduct,
    getById,
    getByName,
    getByMilkType,
    getByStatus,
    getAll,
    getByCategory,
    updProduct,
    deleteProduct
}