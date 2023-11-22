import Users from "../dao/mongo/users.mongo.js";

// const dao = new Users();

export default class UsersRepository {
    constructor(dao) {
        this.dao = new Users();
    }

    async registerUser(user) {
        return await this.dao.registerUser(user);
    }

    async loginUser(email, password) {
        return await this.dao.loginUser(email, password);
    }

    async getUserByEmail(email) {
        return await this.dao.getUserByEmail(email);
    }

    async save (user) {
        return await this.dao.save(user);
    }
}