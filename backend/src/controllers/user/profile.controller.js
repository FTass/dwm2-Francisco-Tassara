const { request, response } = require('express');

const {
    addProfile,
    getProfiles,
    getProfileById,
    updateProfile,
    deleteProfile
} = require('../../service/user/profile.service.js')

const profilePost = async ( req = request, res = response) => {
    try {
        const body = req.body || {};
        if (Object.keys(body).length === 0) return res.status(400).json({msg: 'No data provided'})
        
        const newProfile = await addProfile( body );
        return res.status(201).json({msg: "Profile created", data: newProfile});

    } catch ( error ) {
        console.log( error );
        return res.status(500).json({msg: error.message || 'Server error'});
    }
}


const profileGetById= async (req = request, res = response) => {
    try {
        const { id } = req.params;
        if ( !id ) return res.status(400).json({msg: 'Missing profile ID'});
        const profile = await getProfileById( id );
        return res.status(200).json({ msg: 'Profile found', data: profile})
    } catch ( error ) {
        console.log( error );
        return res.status(500).json({msg: error.message || 'Server error'});
    }
}


const profilesGet= async (req = request, res = response) => {
    try {
        const profiles = await getProfiles();
        return res.status(200).json({msg: 'Profiles fetched', data: profiles});
    } catch ( error ) {
        console.log( error );
        return res.status(500).json({msg: error.message || 'Server error'});
    }
}
const profilePut = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body || {};
        if ( Object.keys(body).length === 0 ) return res.status( 400 ).json({msg: 'missing data'});
        if ( !id ) return res.status( 400 ).json({ msg: 'Missing profile ID'});

        const updatedProfile = await updateProfile( id, body)
        return res.status(200).json({msg: 'Profile updated', data: updatedProfile})

    } catch ( error ) {
        console.log( error );
        return res.status(500).json({msg: error.message || 'Server error'});
    }
}
const profileDel= async (req = request, res = response) => {
    try {
        const { id } = req.params;
        if ( !id ) return res.status( 400 ).json({ msg: 'Missing profile ID'});

        const success = await deleteProfile( id );
        if ( !success ) return res.status( 404 ).json({ msg: 'Profile not found or not deleted'});
        return res.status(204).send()
    }catch ( error ) {
        console.log( error );
        return res.status(500).json({msg: error.message || 'Server error'});
    }
}

module.exports = {
    profilePost,
    profileGetById,
    profilesGet,
    profilePut,
    profileDel,
}