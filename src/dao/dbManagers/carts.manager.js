import cartsModel from '../models/carts.model.js';

export default class Carts {
    constructor() {
        console.log('Working on Carts with DB');
    }

    getAll = async () => {
        const carts = await cartsModel.find().lean();
        return carts;
    }
    getCartById = async (id) => {
        const cart = await cartsModel.findById(id).lean();
        return cart;
    }
    save = async (cart) => {
        const result = await cartsModel.create(cart);
        return result;
    }

    update = async (id, cart) => {
        const result = await cartsModel.updateOne({ _id: id }, cart);
        return result;
    }

    delete = async (id, cart) => {
        const result = await cartsModel.deleteOne({ _id: id }, cart);
        return result;
    }

    async createCart(cartData) {
        try {
            const cart = new cartsModel(cartData);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error);
            throw new Error('Error al crear un nuevo carrito');
        }
    }
//ESTA VERSION FUNCIONA OK PERO AGREGA OBJETOS DE PROD REPETIDOS:
    // async addProductToCart(cartId, productId) {
    //     try {
    //         // Buscar el carrito por su ID
    //         const cart = await cartsModel.findById(cartId);
    
    //         if (!cart) {
    //             throw new Error('Carrito no encontrado');
    //         }
    
    //         // Verificar si el producto ya está en el carrito
    //         const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);
    
    //         if (productIndex === -1) {
    //             // Si el producto no existe en el carrito, lo agregamos con cantidad 1
    //             cart.products.push({ product: productId, quantity: 1 });
    //         } else {
    //             // Si el producto ya está en el carrito, incrementamos la cantidad en 1
    //             cart.products[productIndex].quantity++;
    //         }
    
    //         // Guardar el carrito actualizado
    //         await cart.save();
    
    //         return cart; // Devolvemos el carrito actualizado
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async addProductToCart(cartId, productId) {
        try {
            // Buscar el carrito por su ID y verificar si el producto ya está en el carrito
            const updatedCart = await cartsModel.findOneAndUpdate(
                { 
                    _id: cartId,
                    'products': { $elemMatch: { product: productId } }
                },
                { $inc: { 'products.$.quantity': 1 } },
                { new: true }
            );
    
            if (!updatedCart) {
                throw new Error('Producto o carrito no encontrado');
            }
    
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }
    
}

