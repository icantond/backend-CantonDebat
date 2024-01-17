import mongoose from 'mongoose';

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'premium']
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        default: null
    },
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: {
        type: Date,
        default: new Date()
    }
});

// Middleware para actualizar last_connection antes de guardar
usersSchema.pre('save', function (next) {
    this.last_connection = new Date();
    next();
});
usersSchema.pre('findOne', function () {
    this.populate('cart');
});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;