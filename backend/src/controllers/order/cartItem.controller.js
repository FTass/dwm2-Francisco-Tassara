const { request, response } = require('express');
const service = require('../../service/order/cartItem.service.js');

const cartItemsGet = async (req = request, res = response) => {
  try {
    const { cartId } = req.params;
    const items = await service.getItems(cartId);
    return res.status(200).json({ msg: 'Cart items fetched', data: items });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};


const cartItemGet = async ( req = request, res = response) => {
    try {
    const { cartId, itemId } = req.params;
    if ( !itemId ) return res.status( 400 ).json( { msg: 'Missing item ID' } );
    if ( !cartId ) return res.status( 400 ).json( { msg: 'Missing cart ID' } );
    const item = await service.getItem( cartId, itemId );
    return res.status(200).json({ msg: 'Cart item fetched', data: item });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
}

const cartItemPost = async (req = request, res = response) => {
  try {
    const { cartId } = req.params;
    const created = await service.addItem(cartId, req.body);
    return res.status(201).json({ msg: 'Cart item created', data: created });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const cartItemPut = async (req = request, res = response) => {
  try {
    const { cartId, itemId } = req.params;
    const updated = await service.updateItem(cartId, itemId, req.body);
    return res.status(200).json({ msg: 'Cart item updated', data: updated });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const cartItemDel = async (req = request, res = response) => {
  try {
    const { cartId, itemId } = req.params;
    const deleted = await service.deleteItem(cartId, itemId);
    return res.status(200).json({ msg: 'Cart item deleted', data: deleted });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

module.exports = {
  cartItemsGet,
  cartItemPost,
  cartItemPut,
  cartItemDel,
  cartItemGet
};
