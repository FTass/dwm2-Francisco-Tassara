const Address = require('../../models/user/Address.js')

class Address_Repository {

    async createAddress(input){
        const newAddress = new Address(input)
        await newAddress.save();
        return newAddress;
    }
    
    async  getAddressesByUser(userId) {
        const out = await Address.find({ userId })
            .populate({ path: 'userId', select: 'firstName profile' }) 

        out.forEach(a => {
            if (a.userId && a.userId.profile) delete a.userId.profile;
        });

        return out;
    }

    async getAddressByUserAndId(userId, addressId) {
        return await Address.findOne({ _id: addressId, userId });
    }
    async updateAddressForUser(userId, addressId, input) {
        const address = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            input,
            { new: true }
        );
        return address; // null si no existe o no pertenece
    }
    async deleteAddressForUser(userId, addressId) {
        const { deletedCount } = await Address.deleteOne({ _id: addressId, userId });
        return deletedCount === 1;
    }

}






module.exports = new Address_Repository();


