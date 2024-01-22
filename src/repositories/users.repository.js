import Users from "../dao/mongo/users.mongo.js";


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

    async changeUserRole(userId, newRole) {
        return await this.dao.changeUserRole(userId, newRole);
    }
    
    async uploadDocuments(userId, documents) {
        return await this.dao.uploadDocuments(userId, documents);
    }

    async getAllUsers() {
        return await this.dao.getAllUsers();
    }

    async deleteInactiveUsers(inactiveUsers) {
        return await this.dao.deleteInactiveUsers(inactiveUsers);
    }

    async updateLastConnection(userId){
        const updatedUser = await this.dao.updateLastConnection(userId);
        return updatedUser;
    }
};