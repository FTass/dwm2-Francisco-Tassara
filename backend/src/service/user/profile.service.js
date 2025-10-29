const repo = require('../../../database/repo/user/profile_repo.js')

const addProfile = async ( data ) => {
    const { name } = data;
    if( !name ) throw new Error( 'Missing profile name' )

    if (await repo.getProfileByName( name )) {
        throw new Error('Profile already exists')
    }
    const newProfile = await repo.createProfile( data );
    return newProfile;
}

const getProfiles = async () => {
    const profiles = await repo.getProfiles();
    return profiles;
}

const getProfileById = async ( profileId ) => {
    const profile = await repo.getProfileById( profileId );
    if ( !profile ) throw new Error ( 'Profile not found' );
    return profile
}

const updateProfile = async (profileId, input) => {
    const updated = await repo.updateProfile(profileId, input);
    if (!updated) throw new Error('Profile not found or not updated');
    return updated;
}

const deleteProfile = async (profileId) => {
    const deleted = await repo.deleteProfile(profileId);
    if (!deleted) throw new Error('Profile not found or could not be deleted');
    return { success: true, message: 'Profile deleted successfully' };
}



module.exports = {
    addProfile,
    getProfiles,
    getProfileById,
    updateProfile,
    deleteProfile
}