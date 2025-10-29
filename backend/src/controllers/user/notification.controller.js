const { request, response  } = require('express');

const {
    listUserNotifications,
    getUserNotification,
    createUserNotification,
    updateUserNotification,
    deleteUserNotification,
} = require('../../service/user/notification.service.js')
const notificationsGet = async (req = request, res = response) => {
    try {
        const { userId } = req.params;
        const notifications = await listUserNotifications(userId);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const notificationGet = async (req = request, res = response) => {
    try {
        const { userId, notificationId } = req.params;
        const notification = await getUserNotification(userId, notificationId);
        res.json(notification);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

const notificationPost = async (req = request, res = response) => {
    try {
        const { userId } = req.params;
        const created = await createUserNotification(userId, req.body);
        res.status(201).json(created);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const notificationPut = async (req = request, res = response) => {
    try {
        const { userId, notificationId } = req.params;
        const updated = await updateUserNotification(userId, notificationId, req.body);
        res.json(updated);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

const notificationDel = async (req = request, res = response) => {
    try {
        const { userId, notificationId } = req.params;
        await deleteUserNotification(userId, notificationId);
        res.json({ msg: 'Notification deleted successfully' });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

module.exports = {
    notificationsGet,
    notificationGet,
    notificationPost,
    notificationPut,
    notificationDel,
};
