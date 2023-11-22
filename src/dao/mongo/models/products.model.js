import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number, 
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    status:{
        type: Boolean,
        default: true
    },
    category: {
        type: String, 
        required: true
    },
    thumbnail: Array,
    // thumbnail: {
    //     filename: String,
    //     extension: String,
    // },    // thumbnail:{
    // //     type: Array,
    //     default: [],
    // },
});

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productCollection, productSchema);

export default productsModel;