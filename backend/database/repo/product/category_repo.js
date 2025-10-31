

const Category = require( '../../models/product/Category.js' );


class Category_Repo {

    async createCategory ( input ) {
        const newCategory = new Category( input );
        await newCategory.save();
        return newCategory;
    }

    async getByName ( categoryName ) {
        const category = await Category.findOne( { name : categoryName } );
        return category || null;
    }

    async getById ( categoryId ) {
        const category = await Category.findById( categoryId );
        return category || null;
    }

    async getCategories () {
        const categories = await Category.find();
        return categories || [];
    }

    async getSubCategories ( parentId ) {
        return await Category.find( { parentId } ) || [];
    }

    async updateCategory ( categoryId, input ) {
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            input,
            {
                new : true,
                runValidators : true
            }
        );
        return updatedCategory || null;
    }

    async delCategory( categoryId ) {
        const result = await Category.deleteOne({ _id: categoryId });
        return result.deletedCount === 1;
    }

}

module.exports = new Category_Repo();