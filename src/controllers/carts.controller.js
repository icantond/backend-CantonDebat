import * as CartsService from '../services/carts.service.js';

async function addProductToCart(req, res, next) {
    const productId = req.params.pid;
    try {
        const result = await CartsService.addProductToCart(req.session.user, productId);
        res.status(201).json(result);
    } catch (error) { res.status(error.status || 500).json({
        error: error.error || 'UnknownError',
        description: error.description || 'Error desconocido',
    });
    }
}

async function getCartDetails(req, res) {
    const cartId = req.session.user.cart;
    console.log(cartId);
    try {
        const cartDetails = await CartsService.getCartDetails(cartId);
        res.json(cartDetails);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ status: 'error', message: error.description || 'Error al obtener el carrito' });
    }
}

async function createCart(req, res) {
    try {
        const createdCart = await CartsService.createCart();
        res.status(201).json(createdCart);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.description || 'Error al crear el carrito' });
    }
}

async function deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;

    try {
        const result = await CartsService.deleteProductFromCart(cid, pid);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).json({ message: error.description || 'Error al eliminar el producto del carrito' });
    }
}

async function updateCart(req, res) {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    try {
        const result = await CartsService.updateCart(cartId, newProducts);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).json({ status: 'error', message: error.description || 'Error al actualizar el carrito' });
    }
}

async function updateProductQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    try {
        const result = await CartsService.updateProductQuantity(cartId, productId, newQuantity);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).json({ status: 'error', message: error.description || 'Error al actualizar la cantidad del producto en el carrito' });
    }
}

async function emptyCart(req, res) {
    const cartId = req.params.cid;

    try {
        const result = await CartsService.emptyCart(cartId);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).json({ status: 'error', message: error.description || 'Error al eliminar todos los productos del carrito' });
    }
}

async function purchaseCart(req, res) {
    const cartId = req.params.cid;
    console.log ('Attempting to purchase cart Id: ', cartId)

    try {
        const result = await CartsService.purchaseCart(cartId, req.session.user);
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(error.status || 500).json({ status: 'error', message: error.description || 'Error al procesar la compra' });
    }
}

export {
    addProductToCart,
    getCartDetails,
    createCart,
    deleteProductFromCart,
    updateCart,
    updateProductQuantity,
    emptyCart,
    purchaseCart
};