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
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        default: null                                       
    }
});

usersSchema.pre('findOne', function(){
    this.populate('cart');
});
const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;