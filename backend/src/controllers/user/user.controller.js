const { response, request } = require('express');
const {
    addUser,
    getUser,
    getUsers,
    updUser,
    delUser,
    authenticateUser,
    changepassword,
    registerUser
} = require('../../service/user/user.service.js');

const { ensureOwnerOrAdmin, isAdmin } = require('../../utils/access.js');

const userRegister = async ( req = request, res = response) => {
    try {
        const body = req.body;
        if (Object.keys(body).length === 0) {
            return res.status(400).json({ msg: 'No data provided' });
        }
    
        const registeredUser = await registerUser( body );
        return res.status( 201 ).json( { msg: 'User registered', data: registeredUser } )

    } catch (error) {
        return res.status(error.status || 500).json({ 
            msg: error.message || 'Server error',
            code: error.code || 'UNKNOWN_ERROR',
            status: error.status || 500
        });
    }
}



const userPost = async (req = request, res = response) => {
    const body = req.body;
    if (Object.keys(body).length === 0) {
        return res.status(400).json({ msg: 'No data provided' });
    }
    const newUser = await addUser(body);
    return res.status(201).json({ msg: 'User created', data: newUser });
};

const userGet = async (req = request, res = response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'No ID provided' });
    }
    const user = await getUser(id);
    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }
    if (!ensureOwnerOrAdmin(res, user._id, req.user)) return;
    return res.status(200).json({ msg: 'User fetched', data: user });
};

const userLogin = async (req = request, res = response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }
    try {
        const authResult = await authenticateUser({ email, password });
        return res.status(200).json({ msg: 'Login successful', data: authResult });
    } catch (error) {
        return res.status(401).json({ msg: error.message });
    }
};

const usersGet = async (req = request, res = response) => {
    if (!isAdmin(req.user)) {
        return res.status(403).json({ msg: 'Forbidden' });
    }
    const users = await getUsers();
    return res.status(200).json({ msg: 'Users fetched', data: users });
};

const userPut = async (req = request, res = response) => {
    const { id } = req.params;
    const body = req.body;
    if (!id || Object.keys(body).length === 0) {
        return res.status(400).json({ msg: 'No ID or data provided' });
    }
    const target = await getUser(id);
    if (!target) {
        return res.status(404).json({ msg: 'User not found or not updated' });
    }
    if (!ensureOwnerOrAdmin(res, target._id, req.user)) return;
    const updatedUser = await updUser(id, body);
    if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found or not updated' });
    }
    return res.status(200).json({ msg: 'User updated', data: updatedUser });
};

const userDelete = async (req = request, res = response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'No ID provided' });
    }
    if (!isAdmin(req.user)) {
        return res.status(403).json({ msg: 'Forbidden' });
    }
    const success = await delUser(id);
    if (!success) {
        return res.status(404).json({ msg: 'User not found or not deleted' });
    }
    return res.status(200).json({ msg: 'User deleted' });
};

const changePassword = async (req = request, res = response) => {
    try {
        const { userId } = req.params;
        const { password } = req.body;
        if (!userId) return res.status(400).json({ msg: 'Missing userId' });
        if (!password) return res.status(400).json({ msg: 'Missing password' });
        if (!ensureOwnerOrAdmin(res, userId, req.user)) return;
        const updatedUser = await changepassword(userId, password);
        return res.status(200).json({
            msg: 'Password updated successfully',
            data: { id: updatedUser._id, email: updatedUser.email }
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            msg: error.message || 'Server error'
        });
    }
};

module.exports = {
    userPost,
    userGet,
    usersGet,
    userPut,
    userDelete,
    userLogin,
    changePassword,
    userRegister
};
