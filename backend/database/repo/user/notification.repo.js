
const Notification = require('../../../models/user/notification.model.js');

class NotificationRepo {
    async findByUserId(userId) {
        return await Notification.find({ userId });
    }

    async findOneByIdForUser(notificationId, userId) {
        return await Notification.findOne({ _id: notificationId, userId });
    }

    async create(data) {
        const doc = new Notification(data);
        return await doc.save();
    }

    async update(notificationId, userId, data) {
        return await Notification.findOneAndUpdate(
            { _id: notificationId, userId },
            data,
            { new: true }
        );
    }

    async delete(notificationId, userId) {
        const res = await Notification.deleteOne({ _id: notificationId, userId });
        return res.deletedCount > 0;
    }
}

module.exports = new NotificationRepo();
