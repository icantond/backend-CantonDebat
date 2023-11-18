import usersModel from "./models/users.model.js";

export default class Users {
    constructor() {
        console.log('Working on Users with DB');
    }

    async registerUser(user) {
        return await usersModel.create(user);
    }

    async loginUser(email, password) {
        const user = await usersModel.findOne({ email, password });
        return user;
    }

    async getUserByEmail(email) {
        return await usersModel.findOne({ email });
    }
}