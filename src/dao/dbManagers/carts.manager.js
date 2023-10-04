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
    // addProductToCart = async (cartId, productId, quantity) => {
    //     try {
    //         let cart = await cartsModel.findById(cartId);

    //         if (!cart){
    //             throw new error('Carrito no encontrado');
    //         }
    //         const existingProduct = cart.products.find((product) => product.product.toString() === productId);

    //         if (existingProduct) {
    //             existingProduct.quantity += quantity;
    //         } else {
    //             cart.products.push({ productId, quantity });
    //         }

    //         const savedCart = await cartsModel.findByIdAndUpdate(cartId, cart);
    //         return (console.log('Carrito guardado'),savedCart); 
    //     } catch (error){
    //         throw error;
    //     }
    //     }
    // addProductToCart = async (cartId, productId, quantity) => {
    //     try {
    //         let cart = await cartsModel.findById(cartId);

    //         if (!cart) {
    //             throw new Error('Carrito no encontrado');
    //         }

    //         const existingProduct = cart.products.find((product) => product.product.toString() === productId);

    //         if (existingProduct) {
    //             existingProduct.quantity += quantity;
    //         } else {
    //             cart.products.push({ product: productId, quantity });
    //         }

    //         const savedCart = await cartsModel.findByIdAndUpdate(cartId, cart);
    //         return savedCart;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

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
    // async modifyQuantity(cartId, productId, quantity) {
    //     try {
    //         const cart = await cartsModel.findById(cartId);

    //         if (!cart) {
    //             throw new Error('Carrito no encontrado');
    //         }

    //         const existingProduct = cart.products.find((product) => product.product.toString() === productId);

    //         if (existingProduct) {
    //             existingProduct.quantity += parseInt(quantity);
    //         } else {
    //             throw new Error('Producto no encontrado en el carrito'); // Puedes personalizar el mensaje de error
    //         }

    //         const savedCart = await cartsModel.findByIdAndUpdate(cartId, cart);
    //         return savedCart;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // async modifyQuantity(cartId, productId, quantity) {
    //     try {
    //         const filter = { _id: cartId, 'products.product': productId };
    //         const update = { $set: { 'products.$.quantity': quantity } };

    //         const updatedCart = await cartsModel.findOneAndUpdate(filter, update, { new: true });

    //         if (!updatedCart) {
    //             return null; // El producto o el carrito no se encontraron
    //         }

    //         return updatedCart;
    //     } catch (error) {
    //         console.error('Error al modificar la cantidad del producto en el carrito:', error);
    //         throw error;
    //     }
    // }
    addProductToCart = async (cartId, productId, quantity) => {
        try {
            const updatedCart = await cartsModel.findOneAndUpdate(
                { _id: cartId, 'products.product': productId },
                { $inc: { 'products.$.quantity': quantity } },
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