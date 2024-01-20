import { cartsRepository, productsRepository, ticketsRepository } from "../repositories/index.js";
import configs from "../config/config.js";
import transport from "../config/nodemailer.config.js";
import { smsNumber, client } from '../config/twilio.config.js';
import EErrors from "../middlewares/errors/enums.js";

async function addProductToCart(userId, productId) {
    try {
        const cartId = userId.cart;

        const cart = await cartsRepository.getCartById(cartId);
        const existingProductIndex = cart.products.findIndex(item => item.product.equals(productId));

        const currentUser = userId;

        if (currentUser.role === 'premium') {
            const productBelongsToUser = cart.products.some(item => item.product.equals(productId) && item.product.owner.toString() === currentUser.id.toString());

            if (productBelongsToUser) {
                throw {
                    status: 400,
                    error: 'PremiumUserError',
                    description: 'Un usuario premium no puede agregar su propio producto al carrito',
                };
            }
        }

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        const updatedCart = await cartsRepository.updateCart(cartId, cart);
        return { status: 'success', message: 'Producto agregado al carrito', data: updatedCart };
    } catch (error) {
        if (error.status) {
            throw error;
        }

        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => ({
                field: err.path,
                message: err.message,
            }));

            throw {
                status: 400,
                error: 'ValidationError',
                description: 'Validation error while adding product to cart',
                validationErrors,
            };
        } else {
            throw {
                status: 500,
                error: 'DatabaseError',
                description: 'Error al agregar el producto al carrito',
            };
        }
    }
}

async function getCartDetails(cartId) {
    try {
        const cartDetails = await cartsRepository.getCartDetails(cartId);
        return cartDetails;
    } catch (error) {
        throw {
            status: 500,
            error: 'DatabaseError',
            description: 'Error al obtener el carrito',
        };
    }
}

async function createCart() {
    try {
        const newCart = {
            products: [],
        };

        const createdCart = await cartsRepository.createCart(newCart);

        return createdCart;
    } catch (error) {
        throw {
            status: 500,
            error: 'DatabaseError',
            description: 'Error al crear el carrito',
        };
    }
}

async function deleteProductFromCart(cartId, productId) {
    try {
        const result = await cartsRepository.deleteProductFromCart(cartId, productId);
        return { message: "Producto eliminado correctamente del carrito", data: result };
    } catch (error) {
        throw {
            status: 500,
            error: 'DatabaseError',
            description: 'Error al eliminar el producto del carrito',
        };
    }
}

async function updateCart(cartId, newProducts) {
    try {
        const updatedCart = await cartsRepository.updateCart(cartId, newProducts);
        return { status: 'success', message: 'Carrito actualizado', data: updatedCart };
    } catch (error) {
        throw {
            status: 500,
            error: 'DatabaseError',
            description: 'Error al actualizar el carrito',
        };
    }
}

async function updateProductQuantity(cartId, productId, newQuantity) {
    try {
        const updatedCart = await cartsRepository.updateProductQuantity(cartId, productId, newQuantity);
        return { status: 'success', message: 'Cantidad del producto actualizada en el carrito', data: updatedCart };
    } catch (error) {
        throw {
            status: 500,
            error: 'DatabaseError',
            description: 'Error al actualizar la cantidad del producto en el carrito',
        };
    }
}

async function emptyCart(cartId) {
    try {
        const result = await cartsRepository.emptyCart(cartId);
        return { status: 'success', message: 'Todos los productos eliminados del carrito', data: result };
    } catch (error) {
        throw {
            status: 500,
            error: 'DatabaseError',
            description: 'Error al eliminar todos los productos del carrito',
        };
    }
}

async function purchaseCart(cartId, user) {
    try {
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
                throw {
                    status: 400,
                    success: false,
                    error: 'StockError',
                    message: `No hay suficiente stock para el producto ${product.title}`,
                };
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

        cart.cartTotal = totalPrice;

        await cartsRepository.updateCart(cartId, cart);

        const ticketData = {
            user: user.id,
            products: cart.products.map(cartItem => ({
                product: cartItem.product,
                quantity: cartItem.quantity
            })),
            totalPrice: totalPrice,
        };

        const createdTicket = await ticketsRepository.createTicket(ticketData);

        const productsHTML = cart.products.map(cartItem => `
                <p>
                    <strong>Producto:</strong> ${cartItem.product.title}<br>
                    <strong>Cantidad:</strong> ${cartItem.quantity}<br>
                    <strong>Precio unitario:</strong> $${cartItem.product.price.toFixed(2)}<br>
                    <strong>Subtotal por producto:</strong> $${(cartItem.product.price * cartItem.quantity).toFixed(2)}<br>
                </p>
            `).join('');

        const mailOptions = {
            from: configs.nodemailerUser,
            to: user.email,
            subject: 'Detalles de la compra',
            html: `
                <h1>Te acercamos el detalle de tu compra:</h1>
                ${productsHTML}
            <p><strong>Precio total de la compra:</strong> $${totalPrice.toFixed(2)}</p>
            `
        };

        // Enviar el correo electrónico
        const info = await transport.sendMail(mailOptions);
        console.log('Correo electrónico enviado:', info.response);

        const productsSMS = cart.products.map(cartItem => `
        Producto: ${cartItem.product.title},
        Cantidad: ${cartItem.quantity},
        Precio unitario: $${cartItem.product.price.toFixed(2)},
        Subtotal por producto: $${(cartItem.product.price * cartItem.quantity).toFixed(2)}
    `).join('\n');

    // Construir el mensaje SMS
    const smsMessage = `
        Te acercamos el detalle de tu compra:
        ${productsSMS}
        Precio total de la compra: $${totalPrice.toFixed(2)}
    `;

    // Enviar SMS
    await client.messages.create({
        body: smsMessage,
        from: smsNumber,
        to: configs.phoneNumber, 
    });
    console.log('SMS enviado:', smsMessage);
    await cartsRepository.emptyCart(cartId);
                                            
        return { status: 'success', message: 'Compra finalizada con éxito', ticketData };
    } catch (error) {
        throw {
            status: 500,
            error: 'DatabaseError',
            description: 'Error al procesar la compra',
        };
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