const { Router } = require('express');

const router = Router();

const {
    userPost,
    userGet,
    usersGet,
    userPut,
    userDelete,
    userLogin,
    changePassword
} = require('../../controllers/user/user.controller.js')

const {
    addressDel,
    addressGet,
    addressPost,
    addressPut,
    addressesGet
} = require('../../controllers/user/address.controller.js')

const {
    notificationsGet,
    notificationGet,
    notificationPost,
    notificationPut,
    notificationDel,
} = require('../../controllers/user/notification.controller.js')

router.get('/', usersGet );

router.get('/:id', userGet);

// crear un usuario
router.post('/', userPost);

// Login
router.post('/login', userLogin);

router.put('/:id',  userPut);

router.delete('/:id', userDelete);

// Direcciones del usuario

router.get('/:userId/addresses', addressesGet);               // Obtener todas las direcciones de un usuario

router.get('/:userId/addresses/:addressId', addressGet);    // Obtener una dirección específica de un usuario

router.post('/:userId/addresses', addressPost);              // Crear una nueva dirección para un usuario

router.put('/:userId/addresses/:addressId', addressPut);    // Actualizar una dirección específica

router.delete('/:userId/addresses/:addressId', addressDel); // Eliminar una dirección específica

// Notificaciones del usuario

router.get('/:userId/notifications', notificationsGet);

router.post('/:userId/notifications', notificationPost);

router.put('/:userId/notifications/:notificationId', notificationPut);

router.delete('/:userId/notifications/:notificationId', notificationDel);

router.put('/:userId/password', changePassword);


router.post('/test', (req, res) => {
    console.log('Body recibido:', req.body);
    res.json({ received: req.body });
});

module.exports = router;
