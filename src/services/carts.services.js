import CartsManager from '../dao/dbManagers/carts.manager.js';

const cartsManager = new CartsManager();

async function addProductToCart(cartId, productId) {
    try {
        const updatedCart = await cartsManager.addProductToCart(cartId, productId);
        return updatedCart;
    } catch (error) {
        throw error;
    }
}

async function getCartDetails(cartId) {
    try {
        const cartDetails = await cartsManager.getCartDetails(cartId);
        return cartDetails;
    } catch (error) {
        throw error;
    }
}

async function createCart(newCart) {
    try {
        const createdCart = await cartsManager.save(newCart);
        return createdCart;
    } catch (error) {
        throw error;
    }
}


async function deleteProductFromCart(cartId, productId) {
    try {
        const result = await cartsManager.deleteProductFromCart(cartId, productId);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateCart(cartId, newProducts) {
    try {
        const updatedCart = await cartsManager.updateCart(cartId, newProducts);
        return updatedCart;
    } catch (error) {
        throw error;
    }
}

async function updateProductQuantity(cartId, productId, newQuantity) {
    try {
        const updatedCart = await cartsManager.updateProductQuantity(cartId, productId, newQuantity);
        return updatedCart;
    } catch (error) {
        throw error;
    }
}

async function emptyCart(cartId) {
    try {
        const result = await cartsManager.emptyCart(cartId);
        return result;
    } catch (error) {
        throw error;
    }
}
export {
    addProductToCart,
    getCartDetails,
    createCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantity,
    emptyCart
};
