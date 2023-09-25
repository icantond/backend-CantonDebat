import { Router } from 'express';
import Carts from '../dao/dbManagers/carts.manager.js';

const router = Router();
const cartsManager = new Carts();

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;

    if (!cartId) {
        res.status(400).send({ error: 'ID de carrito inválido' });
        return;
    }
    try {
        const cart = await cartsManager.getCartById(cartId);
        if (!cart) {
            res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
            return;
        }
        res.status(200).send({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'Error al obtener el carrito' });
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

//AGREGAR PRODUCTO AL CARRITO:
router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    console.log('Cart ID:', cartId);//DEPURACION
    console.log('Product ID:', productId);//DEPURACION
    console.log(`Datos de producto a agregar: Carrito Id: ${cartId} ID producto: ${productId} Cantidad: ${quantity}`);

    if (!cartId || !productId || !quantity) {
        res.status(400).send({ error: 'ID de carrito , ID de producto o cantidad inválidos' });
        return;
    } else if (isNaN(quantity)) {
        res.status(400).send({ error: 'La cantidad debe ser un valor numérico' });
        return;
    }

    try {
        let cart = await cartsManager.addProductToCart(cartId, productId, quantity)
        console.log('Carrito después de la actualización:', cartsManager.getCartById(cartId));

        res.status(201).send({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar el producto al carrito' });
    }

});
export default router;