import * as CartsServices from '../services/carts.services.js';

async function addProductToCart(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const updatedCart = await CartsServices.addProductToCart(cartId, productId);
        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'Producto o carrito no encontrado' });
        }
        return res.status(201).json({ status: 'success', message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error al agregar el producto al carrito' });
    }
}

async function getCartDetails(req, res) {
    const cartId = req.params.cid;

    try {
        const cartDetails = await CartsServices.getCartDetails(cartId);
        res.json(cartDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
    }
}

async function createCart(req, res) {
    try {
        const newCart = {
            products: [],
        };

        const createdCart = await CartsServices.createCart(newCart);

        res.status(201).json(createdCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
}

async function deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;

    try {
        const result = await CartsServices.deleteProductFromCart(cid, pid);
        return res.json({ message: "Producto eliminado correctamente del carrito", data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar el producto del carrito" });
    }
}

async function updateCart(req, res) {
    const cartId = req.params.cid;
    const newProducts = req.body.products;

    try {
        const updatedCart = await CartsServices.updateCart(cartId, newProducts);
        return res.json({ status: 'success', message: 'Carrito actualizado', data: updatedCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
    }
}

async function updateProductQuantity(req, res) {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;
    try {
        const updatedCart = await CartsServices.updateProductQuantity(cartId, productId, newQuantity);
        return res.json({ status: 'success', message: 'Cantidad del producto actualizada en el carrito', data: updatedCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
    }
}

async function emptyCart(req, res) {
    const cartId = req.params.cid;
    try {
        const result = await CartsServices.emptyCart(cartId);
        return res.json({ status: 'success', message: 'Todos los productos eliminados del carrito', data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
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
