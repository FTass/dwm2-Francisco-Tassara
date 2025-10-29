const repo= require('../../../database/repo/user/notification.repo.js');


const listUserNotifications = async (userId) => {
    return await repo.findByUserId(userId);
};

const getUserNotification = async (userId, notificationId) => {
    const notification = await repo.findOneByIdForUser(notificationId, userId);
    if (!notification) throw new Error('Notification not found');
    return notification;
};

const createUserNotification = async (userId, data) => {
    const payload = { ...data, userId };
    return await repo.create(payload);
};

const updateUserNotification = async (userId, notificationId, data) => {
    const updated = await repo.update(notificationId, userId, data);
    if (!updated) throw new Error('Notification not found');
    return updated;
};

const deleteUserNotification = async (userId, notificationId) => {
    const ok = await repo.delete(notificationId, userId);
    if (!ok) throw new Error('Notification not found');
    return ok;
};

module.exports = {
    listUserNotifications,
    getUserNotification,
    createUserNotification,
    updateUserNotification,
    deleteUserNotification,
};
