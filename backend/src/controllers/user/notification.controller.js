const { request, response } = require('express');

const {
    listUserNotifications,
    getUserNotification,
    createUserNotification,
    updateUserNotification,
    deleteUserNotification
} = require('../../service/user/notification.service.js');

const { ensureOwnerAdmin } = require('../../utils/access.js');

const notificationsGet = async (req = request, res = response) => {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ msg: 'Missing userId' });
        if (!ensureOwnerAdmin(res, userId, req.user)) return;
        const notifications = await listUserNotifications(userId);
        return res.status(200).json({ msg: 'Notifications fetched', data: notifications });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || 'Server error' });
    }
};

const notificationGet = async (req = request, res = response) => {
    try {
        const { userId, notificationId } = req.params;
        if (!userId || !notificationId) return res.status(400).json({ msg: 'Missing params' });
        if (!ensureOwnerAdmin(res, userId, req.user)) return;
        const notification = await getUserNotification(userId, notificationId);
        if (!notification) return res.status(404).json({ msg: 'Notification not found' });
        return res.status(200).json({ msg: 'Notification fetched', data: notification });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || 'Server error' });
    }
};

const notificationPost = async (req = request, res = response) => {
    try {
        const { userId } = req.params;
        const body = req.body;
        if (!userId) return res.status(400).json({ msg: 'Missing userId' });
        if (Object.keys(body).length === 0) return res.status(400).json({ msg: 'Missing data' });
        const created = await createUserNotification(userId, body);
        return res.status(201).json({ msg: 'Notification created', data: created });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || 'Server error' });
    }
};

const notificationPut = async (req = request, res = response) => {
    try {
        const { userId, notificationId } = req.params;
        const body = req.body;
        if (!userId || !notificationId) return res.status(400).json({ msg: 'Missing params' });
        if (Object.keys(body).length === 0) return res.status(400).json({ msg: 'Missing data' });
        if (!ensureOwnerAdmin(res, userId, req.user)) return;
        const updated = await updateUserNotification(userId, notificationId, body);
        return res.status(200).json({ msg: 'Notification updated', data: updated });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || 'Server error' });
    }
};

const notificationDel = async (req = request, res = response) => {
    try {
        const { userId, notificationId } = req.params;
        if (!userId || !notificationId) return res.status(400).json({ msg: 'Missing params' });
        if (!ensureOwnerAdmin(res, userId, req.user)) return;
        const deleted = await deleteUserNotification(userId, notificationId);
        if (!deleted) return res.status(404).json({ msg: 'Notification not found or not deleted' });
        return res.status(200).json({ msg: 'Notification deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: error.message || 'Server error' });
    }
};

module.exports = {
    notificationsGet,
    notificationGet,
    notificationPost,
    notificationPut,
    notificationDel
};
