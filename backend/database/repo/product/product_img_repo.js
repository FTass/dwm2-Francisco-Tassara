const ProductImg = require("../../models/product/ProductImage.js");

class ProductImg_repo {
  async createImg( input ) {
    const newImg = new ProductImg(input);
    await newImg.save();
    return newImg;
  }

  async getImgs ( productId ) {
    return await ProductImg.find({ productId });
  }

  async getImgByIdAndProductId( imgId, productId ) {
    const img = await ProductImg.findOne({ _id: imgId, productId });
    return img || null;
  }

  async updateImgForProduct( imgId, productId, input ) {
    const img = await ProductImg.findOneAndUpdate(
      { _id: imgId, productId },
      input,
      { new : true, runValidators : true }
    );
    return img || null;
  }

  async deleteImgForProduct( imgId, productId ) {
    const result = await ProductImg.deleteOne({ _id: imgId, productId });
    return result.deletedCount === 1;
  }

  async unsetAllPrimary(productId) {
    await ProductImg.updateMany({ productId }, { isPrimary: false });
  }

}


module.exports = new ProductImg_repo();
