import { Router } from 'express';
import Carts from '../dao/dbManagers/carts.manager.js';
import cartsModel from '../dao/models/carts.model.js';
import productsModel from '../dao/models/products.model.js';

const router = Router();
const cartsManager = new Carts();
const Cart = cartsModel;
const Product = productsModel;

router.post('/:cid/products/:pid', async (req, res) => {
    console.log('Solicitud POST recibida en la ruta /:cid/products/:pid');
    const cartId = req.params.cid;
    const productId = req.params.pid;
    console.log('cartId:', cartId);
    console.log('productId:', productId);

    try {
        // Restar la cantidad del stock disponible en la colección "products"
        await Product.findByIdAndUpdate(productId, {
            $inc: { stock: -1 }, // Restar la cantidad del stock
        });
        const updatedCart = await cartsManager.addProductToCart(cartId, productId);
        if (!updatedCart) {
            throw new Error('Producto o carrito no encontrado');
        }
        res.status(201).json({ status: 'success', message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', message: 'Error al agregar el producto al carrito' });
    }
});



//OBTENER CARRITO POR ID MEDIANTE POPULATE
router.get('/', async (req, res) => {
    try {
        //EL ID DE CARRITO VA HARCODEADO HASTA IMPLEMENTAR USUARIOS
        const cartId = '6518b3030b4bb755731f2cd0';
        const cartItems = await cartsManager.getCartDetails(cartId);

        cartItems.products.forEach((item) => {
            item.totalPrice = item.quantity * item.product.price;
        });

        cartItems.cartTotal = cartItems.products.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);

        res.render('carts', { cartItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
    }
});

//CREAR NUEVO CARRITO VACIO:
router.post('/', async (req, res) => {
    try {
        const newCart = {
            products: [],
        };

        const createdCart = await cartsManager.save(newCart);

        res.status(201).json(createdCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    let carrito = await Cart.findOne({ _id: cid });
    let productos = carrito.products;
    let producto = productos.findIndex((producto) => producto.product.id === pid);
    if (producto !== -1) {
        productos.splice(producto, 1);
        let result = await Cart.findByIdAndUpdate(cid, carrito);
        return res.json({ message: "Producto eliminado correctamente del carrito", data: result });
    } else {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
});
router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const newProducts = req.body.products;
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = newProducts;

        await cart.save();

        res.json({ status: 'success', message: 'Carrito actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', message: 'Error al actualizar el carrito' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

        if (productIndex === -1) {
            return res.status(404).send({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }

        cart.products[productIndex].quantity = newQuantity;

        await cart.save();

        res.json({ status: 'success', message: 'Cantidad del producto actualizada en el carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        await Cart.findByIdAndUpdate(cartId, { products: [] });

        res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
    }
});


export default router;

