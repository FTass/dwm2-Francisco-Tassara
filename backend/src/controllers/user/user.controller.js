const { response, request } = require('express');
const {
    // Importar funciones del servicio de usuario
    addUser,
    getUser,
    getUsers,
    updUser,
    delUser,
    authenticateUser,
    updProfile,
    getFullName,
    changepassword,
    deactivate
} = require('../../service/user/user.service.js');

//! En esto se derivara a un User.Service.js


const userPost = async (req = request, res = response) => {
    const body = req.body;
    if (Object.keys(body).length === 0) {
        return res.status(400).json({ msg: 'No data provided' });
    }
    
    // Llamada a service con body
    const newUser = await addUser(body);
    

    return res.status(201).json({ msg: 'User created', data: newUser });
    
}
const userGet = async (req = request, res = response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'No ID provided' });
    }

    // Llamada a service con id

    const user = await getUser(id);


    return res.status(200).json({ msg: 'User fetched', data: user }); 

}

const userLogin = async (req = request, res = response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    try {
        // Llamada a service para autenticar usuario
        const authResult = await authenticateUser({ email, password });
        return res.status(200).json({ msg: 'Login successful', data: authResult });
    } catch (error) {
        return res.status(401).json({ msg: error.message });
    }

}

const usersGet = async (req = request, res = response) => {
    // Llamada a service para obtener todos los usuarios
    const users = await getUsers();
    
    return res.status(200).json({ msg: 'Users fetched', data: users }); 

}

const userPut = async (req = request, res = response) => {
    const { id } = req.params;
    const body = req.body;
    if (!id || Object.keys(body).length === 0) {
        return res.status(400).json({ msg: 'No ID or data provided' });
    }
    
    const updatedUser = await updUser(id, body);

    if (!updatedUser) {
        return res.status(404).json({ msg: 'User not found or not updated' });
    }

    
    return res.status(200).json({ msg: 'User updated', data: updatedUser});

}
const userDelete = async (req = request, res = response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'No ID provided' });
    }
    
    // Llamada a service con id
    const success = await delUser(id);      
    if (!success) {
        return res.status(404).json({ msg: 'User not found or not deleted' });
    }
    return res.status(200).json({ msg: 'User deleted'});
}


// PUT /api/users/:userId/password
const changePassword = async (req = request, res = response) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;

    if (!userId) return res.status(400).json({ msg: 'Missing userId' });
    if (!password) return res.status(400).json({ msg: 'Missing password' });

    const updatedUser = await changepassword(userId, password);
    return res.status(200).json({
      msg: 'Password updated successfully',
      data: { id: updatedUser._id, email: updatedUser.email }
    });
  } catch (error) {
    console.log(error);
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
    changePassword
}