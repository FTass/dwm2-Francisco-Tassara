// Nueva capa, aca se interactuara con el controller y el repositorio
const  repo = require('backend/database/repo/user_repo.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

//CRUD de usuarios
// requeire el modelo si se va a repositori? 


const addUser = async (userData) => {
    const user = await repo.createUser(userData);
    return user;
}

const getUser = async(userId) =>{
    const user = await repo.getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const getUsers = async() =>{
    const users = await repo.getUsers();
    return users;
}

const updUser = async (userId, updateData) => {
    const updatedUser = await repo.updateUser(userId, updateData);
    if (!updatedUser) {
        throw new Error('User not found or not updated');
    }
    return updatedUser;
};

const delUser = async (userId) => {
    const success = await repo.deleteUser(userId);
    if (!success) {
        throw new Error('User not found or not deleted');
    }
    return success
}


const authenticateUser = async (credentials) => {
    const { email, password } = credentials;
    const user = await repo.getUserByEmail(email);
    if (!user) {
        throw new Error('Authentication failed: User not found');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error('Authentication failed: Incorrect password');
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    return { token, userId: user._id };

};

const updProfile = async (userId, profileId) =>{
    const updatedUser = await repo.updateUser(userId, { profile: profileId });
    if (!updatedUser) {
        throw new Error('User not found or not updated');
    }
    return updatedUser;
}

const changepassword = async(userId, newPassword) =>{
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    const updatedUser = await repo.updateUser(userId, { password: newPasswordHash });
    if (!updatedUser) {
        throw new Error('User not found or not updated');
    }
    return updatedUser;
}

const deactivate = async(userId) =>{
    let newStatus = { isActive: false };
    const updatedUser = await repo.updateUser(userId, newStatus);
    if (!updatedUser) {
        throw new Error('User not found or not updated');
    }
    return updatedUser;
}

const getFullName = async(userId) =>{
    const user = await repo.getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const {firstName, lastName} = user;
    return `${firstName} ${lastName}`;
}

module.exports = {
    addUser,
    getUser,
    getUsers,
    updUser,
    delUser,
    authenticateUser,
    updProfile,
    changepassword,
    deactivate,
    getFullName
};
