import ProductDTO from '../DTOs/products.dto.js';
import Products from '../dao/mongo/products.mongo.js';

export default class ProductsRepository {
    constructor (dao) {
        this.dao = new Products();
    };

    async getAll() {
        return await this.dao.getAll();
    };

    async getQueries ({ limit, skip, sort, query }) {
        return await this.dao.getQueries({ limit, skip, sort, query });
    };

    async getProductById(productId) {
        return await this.dao.getProductById(productId);    
    };

    async addProduct(newProduct) {
        const productDTO = new ProductDTO(newProduct);
        console.log(productDTO);
        return await this.dao.addProduct(productDTO);
    };

    async count () {
        return await this.dao.count();
    };

    async updateProduct(productId, updatedFields) {
        return await this.dao.updateProduct(productId, updatedFields);
    };

    async updateProductStock(productId, newStock) {
        return await this.dao.updateProductStock(productId, newStock);
    }

    async delete(productId) {
        return await this.dao.delete(productId);    
    };

    async getCategories () {
        return await this.dao.getCategories();    
    };

    async getProductsByQuery (queryObj, sortOptions, skip, limit) {
        return await this.dao.getProductsByQuery(queryObj, sortOptions, skip, limit);
    };

    async countProducts(queryObj) {
        return await this.dao.countProducts(queryObj);    
    }
}