const Profile = require('../../models/user/Profile.js')

class Profile_Repository {

    async createProfile (input) {
        const newProfile = new Profile( input );
        await newProfile.save();
        return newProfile
    }

    async getProfiles () {
        return await Profile.find().lean();
    }   

    async getProfileByName( profileName) {
        const profile = await Profile.findOne({ name : profileName});
        if (!profile) return null;
        return profile;
        
    }

    async getProfileById( profileId) {
        const profile = await Profile.findById(profileId);
        return profile ?? null;
    }

    async updateProfile( profileId, input ) {
        const profile = await Profile.findByIdAndUpdate( profileId, input, {
            new: true, 
            runValidators: true,
        } )
        return profile ?? null
    }


    async deleteProfile( profileId ) {
        const deleted = await Profile.findByIdAndDelete(profileId).lean();
        return !!deleted; 
    }
}

module.exports = new Profile_Repository();












