import express from 'express';
import CartManager from '../cartManager.js';

const router = express.Router();
const cartManager = new CartManager('carts.json')

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
    try {
        //Genero ID único para el nuevo carrito
        const newCartId = await cartManager.generateUniqueCartId();
        console.log(`CartID:${newCartId}`);
        // Creo nuevo carrito con array de productos vacío
        const newCart = {
            id: newCartId,
            products: [],
        };
        console.log(newCart);

        //Agrega carrito al JSON
        await cartManager.createCart(newCart); 

        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);

    if (!cartId || isNaN(cartId)) {
        res.status(400).json({ error: 'ID de carrito inválido, debe ser un valor numérico' });
        return;
    }
    try {
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = parseInt(req.body.quantity);

    console.log(cartId, productId, quantity);

    if (!cartId || isNaN(cartId) || !productId || isNaN(productId) || !quantity || isNaN(quantity)) {
        res.status(400).json({ error: 'ID de carrito , ID de producto o cantidad inválidos, deben ser valores numéricos' });
        return;
    }

    try {
        //Obtener carrito por ID
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado' });
            return;
        }
        //Llamo a addProductsToCart pasando los 3 argumentos
        await cartManager.addProductToCart(cartId, productId, quantity);
        //Res con un mensaje de éxito
        res.status(201).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }

    await cartManager.saveCarts();
});

export default router;
