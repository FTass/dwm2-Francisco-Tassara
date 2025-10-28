const Address = require('../../models/user/Address.js')

class Address_Repository {

    async createAddress(input){
        const newAddress = new Address(input)
        await newAddress.save();
        return newAddress;
    }
    
    async getAddressById(id){
        const address = await Address.findById(id);
        if (!address){ 
            return null
        } else {
            return Address
        }
    }

    async getAddressesByUser(userId) {
        return await Address.find({ userId});
    }

    async updateAddress(AddressId, input){
        const address = await Address.findByIdAndUpdate(AddressId, input, {new:true});
        return address;
    }

    async deleteAddress(AddressId) {
        const { deletedCount } = await Address.deleteOne({ _id: AddressId });
        return deletedCount === 1;
    }
}

module.exports = new Address_Repository();