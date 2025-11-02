const { response, request } = require('express');

const {
    addAddress,
    getAddress,
    getAddressesByUserId,
    updAddress,
    delAddress,
    getFullAddress
} = require('../../service/user/address.service');

const { ensureOwnerAdmin } = require('../../utils/access.js');

const addressGet = async (req = request, res = response) => {
    try {
        const { userId, addressId } = req.params;
        if (!userId || !addressId) {
            return res.status(400).json({ msg: 'User Id or Address Id are missing' });
        }
        if (!ensureOwnerAdmin(res, userId, req.user)) return;
        const address = await getAddress(userId, addressId);
        return res.status(200).json({ msg: 'address found', data: address });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || 'Server error' });
    }
};

const addressesGet = async (req = request, res = response) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ msg: 'User Id is missing' });
        if (!ensureOwnerAdmin(res, userId, req.user)) return;
        const addresses = await getAddressesByUserId(userId);
        return res.status(200).json({ msg: 'User Addresses', data: addresses });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || 'Server error' });
    }
};

const addressPost = async (req = request, res = response) => {
    try {
        const { userId } = req.params;
        const body = req.body;
        if (Object.keys(body).length === 0) return res.status(400).json({ msg: 'Missing required data' });
        if (!userId) return res.status(400).json({ msg: 'User ID is missing' });
        if (!ensureOwnerAdmin(res, userId, req.user)) return;
        const newAddress = await addAddress({ ...body, userId });
        return res.status(201).json(newAddress);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || 'Server error' });
    }
};

const addressPut = async (req = request, res = response) => {
    try {
        const { userId, addressId } = req.params;
        const body = req.body;
        if (Object.keys(body).length === 0) {
            return res.status(400).json({ msg: 'missing data' });
        }
        if (!userId || !addressId) {
            return res.status(400).json({ msg: 'User Id or Address Id are missing' });
        }
        if (!ensureOwnerAdmin(res, userId, req.user)) return;
        const updatedAddress = await updAddress(userId, addressId, body);
        return res.status(200).json({ msg: 'Address updated', data: updatedAddress });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || 'Server error' });
    }
};

const addressDel = async (req = request, res = response) => {
    try {
        const { userId, addressId } = req.params;
        if (!userId || !addressId) {
            return res.status(400).json({ msg: 'User Id or Address Id are missing' });
        }
        if (!ensureOwnerAdmin(res, userId, req.user)) return;
        const success = await delAddress(userId, addressId);
        if (!success) {
            return res.status(404).json({ msg: 'Address not found or not deleted' });
        }
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || 'Server error' });
    }
};

module.exports = {
    addressGet,
    addressDel,
    addressPost,
    addressPut,
    addressesGet
};
