const { Router } = require('express');

const router = Router();

const {
    userPost,
    userGet,
    usersGet,
    userPut,
    userDelete,
    userLogin,
} = require('backend/src/controllers/user/user.controller.js')

router.get('/', usersGet );

router.get('/:id', userGet);

// crear un usuario
router.post('/', userPost);

// Login
router.post('/login', userLogin);

router.put('/:id',  userPut);

router.delete('/:id', userDelete);

// Direcciones del usuario

router.get('/:userId/addresses', );

router.post('/:userId/addresses', );

router.put('/:userId/addresses/:addressId', );

router.delete('/:userId/addresses/:addressId', );

// Notificaciones del usuario

router.get('/:userId/notifications', );

router.post('/:userId/notifications', );

router.put('/:userId/notifications/:notificationId', );

router.delete('/:userId/notifications/:notificationId', );

module.exports = router;
