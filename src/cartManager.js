import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';


class CartManager {
    constructor(filePath) {
        this.carts = [];
        this.nextCartId = 0;
        const __filename = fileURLToPath(import.meta.url);
        this.filePath = path.join(path.dirname(__filename), 'db', filePath);
        this.loadCarts();
    }
    async generateUniqueCartId() {
        const cartId = this.nextCartId;
        this.nextCartId++;
        return cartId;
    }
    async createCart(cart) {
        this.carts.push(cart);
        await this.saveCarts();
        console.log(cart)
    }
    async loadCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            if (data) {
                this.carts = JSON.parse(data);
                const lastCart = this.carts[this.carts.length - 1];
                if (lastCart) {
                    this.nextCartId = parseInt(lastCart.id) + 1;
                }
            } else {
                this.carts = [];
            }
        } catch (error) {
            this.carts = [];
        }
    }

    async saveCarts() {
        const data = JSON.stringify(this.carts);
        try{
            await fs.writeFile(this.filePath, data);
            console.log("Carrito actualizado correctamente", data);
        } catch(error) {
            console.error('Error al actualizar el carrito', error);
        }
    }

    async getCartById(id) {
        const cart = this.carts.find((cart) => cart.id === id);
        return cart;
    }
    //Cargo los productos que viven en el JSON para asegurarme que no se intente cargar un producto inexistente
    async loadProducts(){
    };

    async addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find((cart) => cart.id === cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const existingProductIndex = cart.products.findIndex((product) => product.id === productId);
        
        if (existingProductIndex !== -1) {
            // Si el producto ya existe, incremento la cantidad
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Si el producto no existe, agrego al arreglo de productos
            cart.products.push({ id: productId, quantity });
        }
        await this.saveCarts();
    }
}

export default CartManager;
