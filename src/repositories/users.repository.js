export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
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
}