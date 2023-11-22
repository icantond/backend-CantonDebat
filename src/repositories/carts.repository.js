import  CartDTO  from '../DTOs/carts.dto.js';
import Carts from '../dao/mongo/carts.mongo.js';

export default class CartsRepository {
    constructor(dao) {
        this.dao = new Carts();
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

// async function addProductToCart(cartId, productId) {
//     try {
//         const updatedCart = await cartsManager.addProductToCart(cartId, productId);
//         return updatedCart;
//     } catch (error) {
//         throw error;
//     }
// }

// async function getCartDetails(cartId) {
//     try {
//         const cartDetails = await cartsManager.getCartDetails(cartId);
//         return cartDetails;
//     } catch (error) {
//         throw error;
//     }
// }

// async function createCart(newCart) {
//     try {
//         const createdCart = await cartsManager.save(newCart);
//         return createdCart;
//     } catch (error) {
//         throw error;
//     }
// }


// async function deleteProductFromCart(cartId, productId) {
//     try {
//         const result = await cartsManager.deleteProductFromCart(cartId, productId);
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }

// async function updateCart(cartId, newProducts) {
//     try {
//         const updatedCart = await cartsManager.updateCart(cartId, newProducts);
//         return updatedCart;
//     } catch (error) {
//         throw error;
//     }
// }

// async function updateProductQuantity(cartId, productId, newQuantity) {
//     try {
//         const updatedCart = await cartsManager.updateProductQuantity(cartId, productId, newQuantity);
//         return updatedCart;
//     } catch (error) {
//         throw error;
//     }
// }

// async function emptyCart(cartId) {
//     try {
//         const result = await cartsManager.emptyCart(cartId);
//         return result;
//     } catch (error) {
//         throw error;
//     }
// }
// export {
//     addProductToCart,
//     getCartDetails,
//     createCart,
//     deleteProductFromCart,
//     updateCart,
//     updateProductQuantity,
//     emptyCart
// };
