import mongoose from 'mongoose';
import  productCollection from './products.model.js';

const cartCollection = 'carts';
// const productCollection = 'products';

const cartSchema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: productCollection,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 0,
            }
        }
    ]
});
const cartsModel = mongoose.model(cartCollection, cartSchema);

export default cartsModel;