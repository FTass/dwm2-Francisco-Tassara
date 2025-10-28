const  repo = require('../../../database/repo/user/address_repo.js');


const addAddress = async (addressData) => {
    const newAddress = await repo.createAddress(addressData);
    return newAddress
};

const getAddress = async(addressId) => {
    const address = await repo.getAddressById(addressId);
    if (!address) {
        throw new Error('Address not found');
    }
    return address
}

const getAddressesByUserId = async (userId) => {
    const addresses = await repo.getAddressesByUser(userId);
    return addresses
    
}

const updAddress = async (addressId, data) => {
    const updatedAddress = await repo.updateAddress(addressId, data);
    if ( !updatedAddress ) {
        throw new Error('Addres not found')
    }
    return updatedAddress

}

const delAddress = async ( addressId ) => {
    const success = await repo.deleteAddress( addressId );
    if (!success) {
    throw new Error('Address not found or not deleted');
    }

    return success; 
}

//const setAsDefault= async( addresId ) =>{
//    const newStatus = { isDefault: true };
//    const updatedAddress = await repo.updateAddress(addresId, newStatus)
//    if (!updatedAddress) {
//        throw new Error('Address not found or not updated');
//    }
//    return updatedAddress;
//}

const getFullAddress = async (addressId) => {
  const address = await repo.getAddressById(addressId);
  if (!address) throw new Error('Address not found');

  const parts = [
    `${address.street} ${address.number}`.trim(),
    address.apt ? `Depto ${address.apt}` : null,
    address.commune,
    address.city,
  ].filter(Boolean);

  return parts.join(', ');
};

module.exports = {
  addAddress,
  getAddress,
  getAddressesByUserId,
  updAddress,
  delAddress,

  getFullAddress,
};