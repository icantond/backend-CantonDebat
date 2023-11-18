import productsModel from "./models/products.model.js";

export default class Products {
    constructor() {
        console.log('Working on Products whith DB');
    };

    async getAll() {
        return await productsModel.find().lean();
    };

    async getQueries ({ limit, skip, sort, query }){
        return await productsModel.find(query).sort(sort).skip(skip).limit(limit).lean();
    };

    async getProductById(productId) {
        return await productsModel.findById(productId).lean();
    };

    async addProduct(req, res) {
        return await productsModel.create(req.body);
    };

    async count () {
        return await productsModel.countDocuments();
    };

    async updateProduct(productId) {
        return await productsModel.findByIdAndUpdate(productId, req.body, { new: true });
    };

    async delete (id, product) {
        return await productsModel.deleteOne({ _id: id }, product);
    };

    async getCategories () {
        return await productsModel.distinct('category');
    };
}
