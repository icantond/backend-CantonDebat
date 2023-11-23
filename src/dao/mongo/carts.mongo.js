import cartsModel from '../mongo/models/carts.model.js';

export default class Carts {
    constructor() {
        console.log('Working on Carts with DB');
    }

    async addProductToCart(cartId, productId) {
        return await cartsModel.findByIdAndUpdate(cartId, { $push: { products: { product: productId } } }, { new: true });
    }

    async getCartDetails(cartId) {
        return await cartsModel.findById(cartId).populate({
            path: 'products.product',
            select: 'title price description _id'
        }).lean()
    };
    async getCartById (cartId){
        return await cartsModel.findById(cartId);
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