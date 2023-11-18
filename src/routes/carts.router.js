import { Router } from 'express';
import * as CartsController from '../controllers/carts.controller.js';

const router = Router();
// const cartsManager = new Carts();

router.post('/:cid/products/:pid', CartsController.addProductToCart);
router.get('/:cid', CartsController.getCartDetails);
router.post('/', CartsController.createCart);
router.delete("/:cid/products/:pid", CartsController.deleteProductFromCart);
router.put('/:cid', CartsController.updateCart);
router.put('/:cid/products/:pid', CartsController.updateProductQuantity);
router.delete('/:cid', CartsController.emptyCart);

export default router;

// import { cartsRepository } from '../repositories/index.js';

// const router = Router();

// router.post('/:cid/products/:pid', async (req, res) =>{
//     const { cid, pid } = req.params;
//     const cart = await cartsRepository.addProductToCart(cid, pid);
//     res.json(cart);
// });

// router.get('/:cid', async (req, res) =>{
//     const cid = req.params.cid;
//     const cart = await cartsRepository.getCartDetails(cid);
//     res.json(cart);
// });

// router.post('/', async (req, res) =>{
//     const cart = await cartsRepository.createCart();
//     res.json(cart);
// });

// router.delete('/:cid/products/:pid', async (req, res) =>{
//     const { cid, pid } = req.params;
//     const cart = await cartsRepository.deleteProductFromCart(cid, pid);
//     res.json(cart);
// });

// router.put('/:cid', async (req, res) =>{
//     const cid = req.params.cid;
//     const cart = await cartsRepository.updateCart(cid);
//     res.json(cart);
// });

// router.put('/:cid/products/:pid', async (req, res) =>{
//     const { cid, pid } = req.params;
//     const cart = await cartsRepository.updateProductQuantity(cid, pid);
//     res.json(cart);
// });

// router.delete('/:cid', async (req, res) =>{
//     const cid = req.params.cid;
//     const cart = await cartsRepository.emptyCart(cid);
//     res.json(cart);
// });

// export default router;


// router.post('/:cid/products/:pid', async (req, res) => {
//     console.log('Solicitud POST recibida en la ruta /:cid/products/:pid');
//     const cartId = req.params.cid;
//     const productId = req.params.pid;

//     try {
//         const updatedCart = await cartsManager.addProductToCart(cartId, productId);
//         if (!updatedCart) {
//             throw new Error('Producto o carrito no encontrado');
//         }
//         res.status(201).json({ status: 'success', message: 'Producto agregado al carrito' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: 'error', message: 'Error al agregar el producto al carrito' });
//     }
// });

// router.get('/:cid', async (req, res) => {
//     const cartId = req.params.cid;
//     try {
//         const cartDetails = await cartsManager.getCartDetails(cartId);
//         res.json(cartDetails);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Error al obtener el carrito' });
//     }
// });

//CREAR NUEVO CARRITO VACIO:
// router.post('/', async (req, res) => {
//     try {
//         const newCart = {
//             products: [],
//         };

//         const createdCart = await cartsManager.save(newCart);

//         res.status(201).json(createdCart);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al crear el carrito' });
//     }
// });

// router.delete("/:cid/products/:pid", async (req, res) => {
//     const { cid, pid } = req.params;

//     try {
//         const result = await cartsManager.deleteProductFromCart(cid, pid);
//         return res.json({ message: "Producto eliminado correctamente del carrito", data: result });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Error al eliminar el producto del carrito" });
//     }
// });

// router.put('/:cid', async (req, res) => {
//     const cartId = req.params.cid;
//     const newProducts = req.body.products;

//     try {
//         const updatedCart = await cartsManager.updateCart(cartId, newProducts);
//         return res.json({ status: 'success', message: 'Carrito actualizado', data: updatedCart });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 'error', message: 'Error al actualizar el carrito' });
//     }
// });


// router.put('/:cid/products/:pid', async (req, res) => {
//     const cartId = req.params.cid;
//     const productId = req.params.pid;
//     const newQuantity = req.body.quantity;

//     try {
//         const updatedCart = await cartsManager.updateProductQuantity(cartId, productId, newQuantity);
//         return res.json({ status: 'success', message: 'Cantidad del producto actualizada en el carrito', data: updatedCart });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
//     }
// });

// router.delete('/:cid', async (req, res) => {
//     const cartId = req.params.cid;
//     try {
//         const result = await cartsManager.emptyCart(cartId);
//         return res.json({ status: 'success', message: 'Todos los productos eliminados del carrito', data: result });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
//     }
// });

// export default router;

