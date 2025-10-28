const { response, request } = require('express');

//! En esto se derivara a un User.Service.js


const userPost = async (req = request, res = response) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ msg: 'No data provided' });
    }

    // Llamada a service con body
    

    res.status(201).json({ msg: 'User created', data: body });
    

}
const userGet = async (req = request, res = response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'No ID provided' });
    }

    // Llamada a service con id

    res.status(200).json({ msg: 'User fetched', data: { id } }); // en realidad se retornaria el usuario obtenido

}

const usersGet = async (req = request, res = response) => {
    // Llamada a service para obtener todos los usuarios

    res.status(200).json({ msg: 'Users fetched', data: [] }); // en realidad se retornaria la lista de usuarios obtenidos

}

const userPut = async (req = request, res = response) => {
    const { id } = req.params;
    const body = req.body;
    if (!id || !body) {
        return res.status(400).json({ msg: 'No ID or data provided' });
    }
    
    // Llamada a service con id y body
    res.status(200).json({ msg: 'User updated', data: { id, ...body } });

}
const userDelete = async (req = request, res = response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ msg: 'No ID provided' });
    }
    
    // Llamada a service con id
    res.status(200).json({ msg: 'User deleted', data: { id } });
}


module.exports = {
    userPost,
    userGet,
    userPut,
    userDelete
}