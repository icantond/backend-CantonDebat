import ProductDTO from '../DTOs/products.dto.js';

export default class ProductsRepository {
    constructor (dao) {
        this.dao = dao;
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
        return await this.dao.addProduct(productDTO);
    };

    async count () {
        return await this.dao.count();
    };

    async updateProduct(productId) {
        return await this.dao.updateProduct(productId);
    };

    async delete(productId) {
        return await this.dao.delete(productId);    
    };

    async getCategories () {
        return await this.dao.getCategories();    
    };
}