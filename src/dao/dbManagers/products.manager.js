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
            if (error.code === 11000) {
                throw new Error('El código del producto ya existe en la base de datos.');
            } else {
                console.error('Error al agregar el producto a la base de datos:', error);
                throw new Error('Error al agregar el producto a la base de datos');
            }
        }
    }
    
    async getAll() {
        try {
            const products = await productsModel.find().lean();
            return products;
        } catch (error) {
            throw error; 
        }
    }
    async getQueries({ limit, skip, sort, query }) {
        const filter = {}; 
        const options = {
            limit: parseInt(limit),
            skip: parseInt(skip),
            sort,
        };

        if (query) {
            filter.title = { $regex: query, $options: 'i' }; 
        }

        const products = await productsModel.find(filter, null, options).lean();
        return products;
    }
    async count() {
        const count = await productsModel.countDocuments({});
        return count;
    }
    
    getRealTimeProducts = async () => {
        const products = await productsModel.find().lean();
        return products;
    }
    
    getProductById = async (id) => {
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

    getCategories = async (id, product) => {
        const result = await productsModel.distinct('category');
        return result;
    }

    
};