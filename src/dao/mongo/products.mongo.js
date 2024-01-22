import productsModel from "./models/products.model.js";

export default class Products {
    constructor() {
        console.log('Working on Products whith DB');
    };

    async getAll() {
        return await productsModel.find().lean();
    };

    async getQueries({ limit, skip, sort, query }) {
        return await productsModel.find(query).sort(sort).skip(skip).limit(limit).lean();
    };

    async getProductById(productId) {
        return await productsModel.findById(productId).lean();
    };

    async addProduct(product) {
        return await productsModel.create(product);
    };

    async count() {
        return await productsModel.countDocuments();
    };

    async updateProductStock(productId, newStock) {
        return await productsModel.findByIdAndUpdate(productId, { stock: newStock }, { new: true });
    };

    async updateProduct(productId, updatedFields) {
        return await productsModel.findByIdAndUpdate(productId, updatedFields, { new: true });
    };

    async delete(id, product) {
        return await productsModel.deleteOne({ _id: id }, product);
    };

    async getCategories() {
        return await productsModel.distinct('category');
    };

    async getProductsByQuery(queryObj, sortOptions, skip, limit) {
        return await productsModel.find(queryObj).sort(sortOptions).skip(skip).limit(limit).lean();
    };

    async countProducts(queryObj) {
        return await productsModel.countDocuments(queryObj);
    };
}

