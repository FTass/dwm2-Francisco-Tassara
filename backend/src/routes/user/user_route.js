const { Router } = require('express');

const requireAuth = require('../../middlewares/auth');
const requireRole = require('../../middlewares/authorize');
const router = Router();

const {
    userPost,
    userGet,
    usersGet,
    userPut,
    userDelete,
    userLogin,
    changePassword,
    userRegister
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

router.get('/', requireAuth, requireRole('admin'), usersGet); ;

router.get('/:id', requireAuth, userGet); 

// crear un usuario
router.post('/', requireAuth, requireRole('admin'),userPost);     

// Endpoint PUBLICO para registros

router.post('/register', userRegister )



// Login
router.post('/login', userLogin);  

router.put('/:id', requireAuth, userPut);

router.delete('/:id', requireAuth, requireRole('admin'), userDelete); 
// Direcciones del usuario

router.get('/:userId/addresses', requireAuth, addressesGet);              // Obtener todas las direcciones de un usuario

router.get('/:userId/addresses/:addressId', requireAuth, addressGet);    // Obtener una dirección específica de un usuario

router.post('/:userId/addresses', requireAuth, addressPost);              // Crear una nueva dirección para un usuario

router.put('/:userId/addresses/:addressId', requireAuth, addressPut);   // Actualizar una dirección específica

router.delete('/:userId/addresses/:addressId', requireAuth, addressDel); // Eliminar una dirección específica

// Notificaciones del usuario

router.get('/:userId/notifications', requireAuth, notificationsGet);

router.get('/:userId/notifications/:notificationId', requireAuth, notificationGet);

router.post('/:userId/notifications', requireAuth, requireRole('admin'), notificationPost);

router.put('/:userId/notifications/:notificationId', requireAuth, requireRole('admin'), notificationPut);

router.delete('/:userId/notifications/:notificationId', requireAuth, requireRole('admin'), notificationDel);


router.put('/:userId/password', requireAuth, changePassword);


router.post('/test', (req, res) => {
    console.log('Body recibido:', req.body);
    res.json({ received: req.body });
});

module.exports = router;
