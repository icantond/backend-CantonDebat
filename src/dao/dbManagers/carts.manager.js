import cartsModel from '../models/carts.model.js';
import mongoose from 'mongoose';

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

    async addProductToCart(cartId, productId) {
        try {
            const cart = await cartsModel.findById(cartId);
            const productIndex = cart.products.findIndex(item => item.product.equals(productId));

            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            const updatedCart = await cart.save();

            return updatedCart;
        } catch (error) {
            throw error;
        }
    }
    async getCartDetails(cartId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error('ID de carrito no válido');
            }

            const cart = await cartsModel.findById(cartId)
                .populate({
                    path: 'products.product',
                    select: 'title price description _id stock',
                })
                .lean();

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart;
        } catch (error) {
            throw error;
        }
    }
}

