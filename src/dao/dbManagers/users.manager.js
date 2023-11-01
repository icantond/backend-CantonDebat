import usersModel from "../models/users.model.js";

export default class Users {
    constructor() {
        console.log('Working with users with DB');
    }
    async getByEmail(email){
        const user = await usersModel.findOne({email}).lean();
        return user;
        }
        
    async createUser(user){
        const result = await usersModel.create(user);
        return result;
    }

    async save(user) {
        const result = await usersModel.updateOne(user);
        console.log('updated cart for user from users manager: ', result)
        return result
    }
    
    async updateCart(userId, cartId) {
        try {
            const user = await usersModel.findById(userId);
            if (user) {
                user.cart = cartId;
                await user.save();
                return user;
            }
            return null; // El usuario no se encontró
        } catch (error) {
            throw new Error('Error al actualizar el carrito del usuario: ' + error.message);
        }
    }

    async getUserById(userId) {
        const user = await usersModel.findById(userId).lean();
        return user;
    }
}