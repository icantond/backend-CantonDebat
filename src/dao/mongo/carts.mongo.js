import cartsModel from '../mongo/models/carts.model.js';

export default class Carts {
    constructor() {
        console.log('Working on Carts with DB');
    }

    async addProductToCart(cartId, productId) {
        return await cartsModel.findByIdAndUpdate(cartId, { $push: { products: { product: productId } } }, { new: true });
    }

    async getCartDetails(cartId) {
        return await cartsModel.findById(cartId).populate('products.product');
    }

    async createCart(cartData) {
        return await cartsModel.create(cartData);
    }

    async deleteProductFromCart(cartId, productId) {
        return await cartsModel.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } }, { new: true });
    }
    
    async updateCart (id, cart) {
        return await cartsModel.updateOne({ _id: id }, cart);
    }

    async emptyCart (cartId) {
        return await cartsModel.findByIdAndUpdate( cartId, { products: [] } );
    }
}
    // async getAll () {
    //     return await cartsModel.find().lean();
    // }
    
    // async getCartById (id) {
    //     return await cartsModel.findById(id).lean();
    // }

    // async save (cart) {
    //     return await cartsModel.create(cart);
    // }

    

    // async delete (id, cart) {
    //     return await cartsModel.deleteOne({ _id: id }, cart);
    // }


    

//     getAll = async () => {
//         const carts = await cartsModel.find().lean();
//         return carts;
//     }
//     getCartById = async (id) => {
//         const cart = await cartsModel.findById(id).lean();
//         return cart;
//     }
//     save = async (cart) => {
//         const result = await cartsModel.create(cart);
//         return result;
//     }

//     update = async (id, cart) => {
//         const result = await cartsModel.updateOne({ _id: id }, cart);
//         return result;
//     }

//     delete = async (id, cart) => {
//         const result = await cartsModel.deleteOne({ _id: id }, cart);
//         return result;
//     }

//     async createCart(cartData) {
//         try {
//             const cart = new cartsModel(cartData);
//             await cart.save();
//             return cart;
//         } catch (error) {
//             console.error('Error al crear un nuevo carrito:', error);
//             throw new Error('Error al crear un nuevo carrito');
//         }
//     }

//     async addProductToCart(cartId, productId) {
//         try {
//             const cart = await cartsModel.findById(cartId);
//             const productIndex = cart.products.findIndex(item => item.product.equals(productId));

//             if (productIndex !== -1) {
//                 cart.products[productIndex].quantity++;
//             } else {
//                 cart.products.push({ product: productId, quantity: 1 });
//             }

//             const updatedCart = await cart.save();

//             return updatedCart;
//         } catch (error) {
//             throw error;
//         }
//     }
//     async getCartDetails(cartId) {
//         try {
//             if (!mongoose.Types.ObjectId.isValid(cartId)) {
//                 throw new Error('ID de carrito no válido');
//             }

//             const cart = await cartsModel.findById(cartId)
//                 .populate({
//                     path: 'products.product',
//                     select: 'title price description _id stock',
//                 })
//                 .lean();

//             if (!cart) {
//                 throw new Error('Carrito no encontrado');
//             }

//             return cart;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async deleteProductFromCart(cartId, productId) {
//         try {
//             const cart = await cartsModel.findById(cartId);
    
//             if (!cart) {
//                 throw new Error('Carrito no encontrado');
//             }
    
//             const productIndex = cart.products.findIndex(item => item.product.equals(productId));
    
//             if (productIndex !== -1) {
//                 cart.products.splice(productIndex, 1);
//                 const result = await cart.save();
//                 return result;
//             } else {
//                 throw new Error('Producto no encontrado en el carrito');
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     async emptyCart(cartId) {
//         try {
//             const cart = await cartsModel.findByIdAndUpdate(cartId, { products: [] });
//             return cart;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async updateCart(cartId, newProducts) {
//         try {
//             const cart = await cartsModel.findById(cartId);
    
//             if (!cart) {
//                 throw new Error('Carrito no encontrado');
//             }
    
//             cart.products = newProducts;
//             const updatedCart = await cart.save();
    
//             return updatedCart;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async updateProductQuantity(cartId, productId, newQuantity) {
//         try {
//             const cart = await cartsModel.findById(cartId);
    
//             if (!cart) {
//                 throw new Error('Carrito no encontrado');
//             }
    
//             const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);
    
//             if (productIndex === -1) {
//                 throw new Error('Producto no encontrado en el carrito');
//             }
    
//             cart.products[productIndex].quantity = newQuantity;
//             await cart.save();
    
//             return cart;
//         } catch (error) {
//             throw error;
//         }
//     }
// }

