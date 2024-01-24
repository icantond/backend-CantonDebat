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

    async getUserById(id) {
        console.log('Attempting to find user by id ', id, 'from users.mongo.js')
        return await usersModel.findById(id);
    }

    async save(user) {
        return await usersModel.findByIdAndUpdate(user._id, user, { new: true });
    }

    
    async changeUserRole(userId, newRole) {
        return await usersModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });
    }

    async uploadDocuments(userId, documents) {
        return await usersModel.findByIdAndUpdate(
            { _id: userId },
            { $push: { documents: { $each: documents } } },
            { new: true }
        );
    }

    async getAllUsers() {
        return await usersModel.find().lean();
    };

    async deleteInactiveUsers(inactiveUsers) {
        await usersModel.deleteMany({ 
            _id: {
                $in: inactiveUsers.map(user => user._id) 
            }
        });
    }

    async updateLastConnection (userId) {
        return await usersModel.findByIdAndUpdate(
            userId,
            { last_connection: new Date() },
            { new: true }
            );
    }
}   