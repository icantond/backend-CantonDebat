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
            console.error('Error al agregar el producto a la base de datos:', error);
            throw new Error('Error al agregar el producto a la base de datos');
        }
    }
    async getAll() {
        try {
            const products = await productsModel.find().lean();
            return products;
        } catch (error) {
            throw error; // Maneja el error adecuadamente o regresa una respuesta de error HTTP en lugar de lanzar una excepción.
        }
    }
    async getQueries({ limit, skip, sort, query }) {
        const filter = {}; // Aquí puedes construir el filtro de búsqueda según tus necesidades
        const options = {
            limit: parseInt(limit),
            skip: parseInt(skip),
            sort,
        };

        if (query) {
            // Puedes agregar condiciones de búsqueda aquí según tu lógica
            filter.title = { $regex: query, $options: 'i' }; // Búsqueda insensible a mayúsculas y minúsculas en el título
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
};
