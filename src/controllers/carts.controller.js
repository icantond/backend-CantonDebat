import { cartsRepository, productsRepository, ticketsRepository } from "../repositories/index.js";

async function addProductToCart (req, res) {
    const productId = req.params.pid;
    const cartId = req.session.user.cart;

    try {
        const cart = await cartsRepository.getCartById(cartId);

        const existingProductIndex = cart.products.findIndex(item => item.product.equals(productId));

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        const updatedCart = await cartsRepository.updateCart(cartId, cart);

        return res.status(201).json({ status: 'success', message: 'Producto agregado al carrito', data: updatedCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error al agregar el producto al carrito' });
    }
}

async function getCartDetails(req, res) {
    const cartId = req.params.user.cart;
    console.log(cartId);
    try {
        const cartDetails = await cartsRepository.getCartDetails(cartId);
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

        const createdCart = await cartsRepository.createCart(newCart);

        res.status(201).json(createdCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
}

async function deleteProductFromCart(req, res) {
    const { cid, pid } = req.params;

    try {
        const result = await cartsRepository.deleteProductFromCart(cid, pid);
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
        const updatedCart = await cartsRepository.updateCart(cartId, newProducts);
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
        const updatedCart = await cartsRepository.updateProductQuantity(cartId, productId, newQuantity);
        return res.json({ status: 'success', message: 'Cantidad del producto actualizada en el carrito', data: updatedCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
    }
}

async function emptyCart(req, res) {
    const cartId = req.params.cid;
    try {
        const result = await cartsRepository.emptyCart(cartId);
        return res.json({ status: 'success', message: 'Todos los productos eliminados del carrito', data: result });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
    }
}

async function purchaseCart(req, res) {
    const cartId = req.params.cid;

    try {
        const cartId = req.params.cid;
        const cart = await cartsRepository.getCartDetails(cartId);

        const productsToUpdate = [];

        for (const cartItem of cart.products) {
            const product = await productsRepository.getProductById(cartItem.product);
            if (product.stock >= cartItem.quantity) {
                productsToUpdate.push({
                    productId: product._id,
                    newStock: product.stock - cartItem.quantity,
                });
            } else {
            return res.status(400).json({ success: false, message: `No hay suficiente stock para el producto ${product.title}` });            
            }
        }

        const updatePromises = productsToUpdate.map(async (updateInfo) => {
            return productsRepository.updateProductStock(updateInfo.productId, updateInfo.newStock);
        });

        await Promise.all(updatePromises);

        const totalPrice = cart.products.reduce((total, cartItem) => {
            const productPrice = cartItem.product.price;
            const quantity = cartItem.quantity;
            return total + productPrice * quantity;
        }, 0);

        // Actualizar el carrito con el precio total
        cart.cartTotal = totalPrice;

        await cartsRepository.updateCart(cartId, cart);
        console.log('Grabando ticket de usuario id: ', req.session.user.id, req.session.user.email);

        const ticketData = {
            user: req.session.user.id,
            products: cart.products.map(cartItem => ({
                product: cartItem.product,
                quantity: cartItem.quantity
            })),
            totalPrice: totalPrice,
        };
        
        const createdTicket = await ticketsRepository.createTicket(ticketData);

        res.status(200).json({ success: true, message: 'Compra finalizada con éxito', ticketData });
        await cartsRepository.emptyCart(cartId);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al procesar la compra' });
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
