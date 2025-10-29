const Product = require('../../models/product/Product.js')

class Product_Repository {

    // Crear Producto
    async createProduct(input){
        const newProduct = new Product(input);
        await newProduct.save();
        return newProduct;
    }

    async getProductById ( productId ) {
        const product = await Product.findById( productId );
        if ( !product ) return null;
        return product;
        
    }

    async getProductByName( productName ) {
        const product = await Product.findOne( { name: productName });
        if ( !product ) return null;
        return product;
    }

    async getCheesesByMilkType ( milkType ) {
        const product = await Product.find( { milkType });
        if ( !product ) return null;
        return product;
    }
    
    async getProductsByStatus ( status ) {
        const product = await Product.find( {status});
        if ( !product ) return null;
        return product;
    }

    async getProducts () {
        const products = await Product.find();
    }

    
    async getProductsByCategory( categoryId ) {
        return await Product.find({ categoryId });
    }

    async updateProduct(productId, input){
        const product = await Product.findByIdAndUpdate(productId, input, {
            new:true
        });
        return product;
    }

    async deleteProduct(productId) {
        const result = await Product.deleteOne({ _id: productId });
        return result.deletedCount === 1;
    }
}

module.exports = new Product_Repository();