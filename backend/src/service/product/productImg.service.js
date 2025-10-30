const repo = require('../../../database/repo/product/product_img_repo.js')


const addImg = async ( data ) => {
    const newImg = await repo.createImg( data );
    return newImg;
}

const getImg = async ( imgId, productId ) => {
    const img = await repo.getImgByIdAndProductId( imgId, productId );
    if ( !img ) throw new Error ('Image not found');
    return img;
}

const getProductImgs = async ( productId ) => {
    const imgs = await repo.getImgs( productId );
    return imgs; 
}

const updImg = async ( imgId, productId, data ) => {
    const updatedImg = await repo.updateImgForProduct ( imgId, productId, data );
    if ( !updatedImg ) throw new Error( 'Image not found' )
}

const delImg = async ( imgId, productId ) => {
    const success = await repo.deleteImgForProduct ( imgId, productId );
    if ( !success ) throw new Error ( 'Image not found or not deleted' );
    return success;
}

const setPrimary = async (imgId, productId) => {
    await repo.unsetAllPrimary( productId )
  const updatedImg = await repo.setPrimaryImg(productId, imgId);
  if (!updatedImg) throw new Error('Image not found');
  return updatedImg;
};

module.exports = {
    addImg,
    getImg,
    getProductImgs,
    updImg,
    delImg,
    setPrimary
}