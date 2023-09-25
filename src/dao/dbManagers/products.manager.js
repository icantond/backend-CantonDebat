// import { productsModel } from '../models/products.model.js';
// import ProductManager from '../../productManager.js';
import productsModel from '../models/products.model.js';

export default class Products {
    constructor() {
        console.log('Working on products with DB');
    }

    async addProduct(productData) {
        try {
            const product = new productsModel(productData);
            await product.save();
            return product;
        } catch (error) {
            throw new Error('Error al agregar el producto a la base de datos');
        }
    }

    getAll = async () => {
        const products = await productsModel.find().lean();
        return products;
    }
    getProductById = async(id) => {
        const result = await productsModel.findById(id); 
        return result;
    }
    save = async (product) => {
        const result = await productsModel.create(product);
        return result;
    }

    update = async (id, product) => {
        const result = await productsModel.updateOne({ _id: id }, product);
        return result;
    }
    
    delete = async (id, product) => {
        const result = await productsModel.deleteOne({ _id: id }, product);
        return result;
    }
};
