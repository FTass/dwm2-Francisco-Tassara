const { request, response } = require('express');
const service = require('../../service/order/cart.service.js');
const { ensureOwnerOrAdmin, isAdmin } = require('../../utils/access.js');

const cartsGet = async (req = request, res = response) => {
  try {
    const query = isAdmin(req.user) 
      ? req.query // si es admin, admite cualquier parametrod el query
      : { ...req.query, userId: req.user._id }; // si no, seteamos el userId del logeado
    const carts = await service.getCarts(query);
    return res.status(200).json({ msg: 'Carts fetched', data: carts });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const cartGet = async (req = request, res = response) => {
  try {
    const { cartId } = req.params;
    if (!cartId) return res.status(400).json({ msg: 'Missing cartId' });
    const cart = await service.getCartById(cartId);
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });
    if (!ensureOwnerOrAdmin(res, cart.userId, req.user)) return;
    return res.status(200).json({ msg: 'Cart fetched', data: cart });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const cartPost = async (req = request, res = response) => {
  try {
    const created = await service.addCart({ ...req.body, userId: req.user._id });
    return res.status(201).json({ msg: 'Cart created', data: created });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const cartPut = async (req = request, res = response) => {
  try {
    const { cartId } = req.params;
    if (!cartId) return res.status(400).json({ msg: 'Missing cartId' });
    const current = await service.getCartById(cartId);
    if (!current) return res.status(404).json({ msg: 'Cart not found' });
    if (!ensureOwnerOrAdmin(res, current.userId, req.user)) return;
    const updated = await service.updateCart(cartId, req.body);
    return res.status(200).json({ msg: 'Cart updated', data: updated });
  } catch (error) {
    return res.status(error.status || 500).json({ msg: error.message || 'Server error' });
  }
};

const cartDel = async (req = request, res = response) => {
  try {
    const { cartId } = req.params;
    if (!cartId) return res.status(400).json({ msg: 'Missing cartId' });
    const current = await service.getCartById(cartId);
    if (!current) return res.status(404).json({ msg: 'Cart not found' });
    if (!ensureOwnerOrAdmin(res, current.userId, req.user)) return;
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
  cartDel
};
