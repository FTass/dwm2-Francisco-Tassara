const repo = require('../../../database/repo/product/product_repo.js')


const addProduct = async ( input ) => {
    const product = await repo.createProduct( input );
    return product
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
    const updatedProduct = await repo.updateProduct( productId, input );
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