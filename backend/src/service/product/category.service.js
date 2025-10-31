const repo = require('../../../database/repo/product/category_repo.js')
const slugify = require('slugify');

class CategoryService {


    async addCategory ( data ) {
        if ( !data.name || data.name.trim().length === 0) throw new Error( 'Missing Category name' ) ;
        if ( !data.description ) throw new Error ( 'Missing Category description' );
        if ( !data.slug && data.name) {
            data.slug = slugify(data.name, { lower:true, strict: true})
        }
        if ( await repo.getBySlug( data.slug ) ) throw new Error ( `Category with slug '${data.slug}' already exists` );
        const newCategory = await repo.createCategory( data );
        return newCategory;
    }

    async getCategoryByName ( categoryName ) {
        if ( !categoryName ) throw new Error ( 'Category name is required' )
        const category = await repo.getByName( categoryName );
        if ( !category ) throw new Error ( 'Category not found' );
        return category;
    }

    async getCategoryById ( categoryId ) {
        if ( !categoryId ) throw new Error ( 'Category ID is required' )

        const category = await repo.getById( categoryId );
        if ( !category ) throw new Error ( 'Category not found' );
        return category;
    }

    async getCategoryBySlug( categorySlug ) {
        if ( !categorySlug ) throw new Error ( 'Slug is required' );
        const category = await repo.getBySlug( categorySlug );
        if ( !category ) throw new Error ( 'Category not found' );
        return category;
    }

    async getCategories () {
        const categories = await repo.getCategories();
        return categories;
    }

    async getSubCategories ( parentId ) {
        const categories = await repo.getSubCategories( parentId );
        return categories;
    }

    async updCategory ( categoryId, data ) {   
        if ( !categoryId ) throw new Error ( 'Category ID is required' );

        if ( data.name && !data.slug) {
            data.slug = slugify( data.name, { lower:true, strict: true } );
        }

        if (data.slug) {
            const exists = await repo.getBySlug(data.slug);
            if (exists && exists._id.toString() !== categoryId) {
                throw new Error(`Category with slug '${data.slug}' already exists`);
            }
        }

        const updateCategory = await repo.updateCategory( categoryId, data );
        if ( !updateCategory ) throw new Error ( 'Category not found or not uptaded' );
        return updateCategory;
    }

    async delCategory ( categoryId ) {
        if ( !categoryId ) throw new Error ( 'Category ID is required' );
        const success = await repo.deleteCategory( categoryId );
        if (!success) throw new Error('Category not found or could not be deleted');
        return { success: true, message: 'Category deleted successfully' };
    }

}

module.exports = new CategoryService();