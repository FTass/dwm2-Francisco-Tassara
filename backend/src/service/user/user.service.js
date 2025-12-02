
const  repo = require('../../../database/repo/user/user_repo.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';


const checkPwd = async ( pwd ) => {
    const haveSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test( pwd);
    
    if ( pwd.length > 15) {
        const e = new Error('Password is longer than 15 characters');
        e.status = 400;
        e.code = 'INVALID_PASSWORD_LENGTH'
        throw e;
    }

    if ( !haveSpecialChar ) {
        const e = new Error('Password require special characters');
        e.status = 400;
        e.code = 'REQUIRED_CHAR'
        throw e;
    }
}




//CRUD de usuarios
const registerUser = async ( userData ) => {
    try {
        const existingUser = await repo.getUserByEmail(userData.email);
        if (existingUser) {
            const e = new Error('Email already registered')
            e.code = 'EMAIL_EXISTS'
            e.status = 409;
            throw e;
        }

        const password = userData.password;
        await checkPwd(password);  // ← Pasar el password
       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await repo.createUser({
            ...userData,
            profile: '69025c4403fb1ee551b6059b',
            password: hashedPassword,
            isActive: userData.isActive !== undefined ? userData.isActive : true,
            failedLoginAttempts: 0
        });
        const userResponse = user.toObject();
        delete userResponse.password;

        return userResponse;
    } catch ( error ) {
        throw error;
    }
}





const addUser = async (userData) => {
    try {
        // Verificar si el email ya existe
        const existingUser = await repo.getUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Hashear la contraseña antes de guardar
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Crear usuario con contraseña hasheada
        const user = await repo.createUser({
            ...userData,
            profile: '69025c4403fb1ee551b6059b',
            password: hashedPassword,
            isActive: userData.isActive !== undefined ? userData.isActive : true,
            failedLoginAttempts: 0
        });

        // No devolver la contraseña
        const userResponse = user.toObject();
        delete userResponse.password;

        return userResponse;
    } catch (error) {
        throw new Error(error.message || 'Error creating user');
    }
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


const authenticateUser = async ( credentials ) => {
    try {
        const { email, password } = credentials;

        // Buscar usuario por email
        const user = await repo.getUserByEmail(email);
        if (!user) {
            throw new Error('Authentication failed: User not found');
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            throw new Error('Authentication failed: User is inactive');
        }

        // Comparar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Authentication failed: Incorrect password');
        }

        // Generar token JWT
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return {
            token,
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                profile: user.profile
            }
        };
    } catch (error) {
        throw new Error(error.message || 'Authentication failed');
    }
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
    getFullName,
    registerUser
};
