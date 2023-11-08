import usersModel from '../models/users.model.js';

export default class UsersManager {
    async createUser(userData) {
        try {
            const user = await usersModel.create(userData);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await usersModel.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }
}