const { Router } = require('express');

const router = Router();

router.get('/', );

router.get('/:id', );

router.post('/', );

router.put('/:id', );

router.delete('/:id', );

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
