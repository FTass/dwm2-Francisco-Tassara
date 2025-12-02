const User = require('../../models/user/User')

class User_Repository {

    // Crear usuario
    async createUser(input){
        const newUser = new User(input)
        await newUser.save();
        return newUser;
    }

    

    // Entrga todos los usuarios
    async getUsers(){
        const users = await User.find();
        return users;
    }
    
    // Busca usuarrio por su id
    async getUserById(id){
        const user = await User.findById(id);
        if (!user){ 
            return null
        } else {
            return user
        }
    }

    // Busca usuario por su correo
    async getUserByEmail(email) {
        const user = await User.findOne({ email: email });
        if  (!user){
            return null
        } else {
            return user;
        }
    }

        
    // Retorna todos los usuarios por perfil
    async getUsersByProfile(profileId) {
        return await User.find({ profile: profileId });
    }

   

    async updateUser(userId, input){
        const user = await User.findByIdAndUpdate(userId, input);
        return user;
    }

    async deleteUser(userId) {
        const { deletedCount } = await User.deleteOne({ _id: userId });
        return deletedCount === 1;
    }
}

module.exports = new User_Repository();