import cartsModel from '../models/carts.model.js';

export default class Carts{
    constructor(){
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
        const result = await cartsModel.deleteOne({ _id: id}, cart);
        return result;
    }
    addProductToCart = async (cartId, productId) => {
        try {
            let cart = await cartsModel.findById(cartId);
            
            if (!cart){
                throw new error('Carrito no encontrado');
            }
            const existingProduct = cart.products.find((product) => product.productId.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }

            const savedCart = await cartsModel.findByIdAndUpdate(cartId, cart);
            return (console.log('Carrito guardado'),savedCart); 
        } catch (error){
            throw error;
        }
        }
    }