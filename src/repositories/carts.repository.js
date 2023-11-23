import  CartDTO  from '../DTOs/carts.dto.js';
import Carts from '../dao/mongo/carts.mongo.js';

export default class CartsRepository {
    constructor(dao) {
        this.dao = new Carts();
    }
    
    async getCartById (cartId) {
        return await this.dao.getCartById(cartId);
    }
    
    async addProductToCart(cartId, productId) {
        return await this.dao.addProductToCart(cartId, productId);
    }

    async getCartDetails(cartId) {
        return await this.dao.getCartDetails(cartId);
    }

    async createCart(newCart) {
        const cartsDTO = new CartDTO(newCart);
        return await this.dao.createCart(cartsDTO);
    }

    async deleteProductFromCart(cartId, productId) {
        return await this.dao.deleteProductFromCart(cartId, productId);
    }

    async updateCart(cartId, newProducts) {
        return await this.dao.updateCart(cartId, newProducts);
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        return await this.dao.updateProductQuantity(cartId, productId, newQuantity);
    }

    async emptyCart(cartId) {
        return await this.dao.emptyCart(cartId);
    }

};