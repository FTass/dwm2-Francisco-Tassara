const { request, response } = require('express');
const service = require('../../service/cart/cart.service.js');

const cartsGet = async (req = request, res = response) => {
  try {
    const carts = await service.getCarts(req.query);
    return res.status(200).json({ msg: 'Carts fetched', data: carts });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const cartGet = async (req = request, res = response) => {
  try {
    const { cartId } = req.params;
    const cart = await service.getCartById(cartId);
    return res.status(200).json({ msg: 'Cart fetched', data: cart });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const cartPost = async (req = request, res = response) => {
  try {
    const created = await service.addCart(req.body);
    return res.status(201).json({ msg: 'Cart created', data: created });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const cartPut = async (req = request, res = response) => {
  try {
    const { cartId } = req.params;
    const updated = await service.updateCart(cartId, req.body);
    return res.status(200).json({ msg: 'Cart updated', data: updated });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const cartDel = async (req = request, res = response) => {
  try {
    const { cartId } = req.params;
    const deleted = await service.deleteCart(cartId);
    return res.status(200).json({ msg: 'Cart deleted', data: deleted });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

module.exports = {
  cartsGet,
  cartGet,
  cartPost,
  cartPut,
  cartDel,
};
