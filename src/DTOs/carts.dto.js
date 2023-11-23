export default class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.user = cart.user;
        this.products = cart.products.map(product => ({
            productId: product.product,
            quantity: product.quantity
        }));
    }
};