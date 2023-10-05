// import { Router } from 'express';
// import Carts from '../dao/dbManagers/carts.manager.js';
// import cartsModel from '../dao/models/carts.model.js';
// import productsModel from '../dao/models/products.model.js';

// const router = Router();
// const cartsManager = new Carts();
// const Cart = cartsModel;
// const Product = productsModel;
// // router.get('/:cid', async (req, res) => {
// //     const cartId = req.params.cid;

// //     if (!cartId) {
// //         res.status(400).send({ error: 'ID de carrito inválido' });
// //         return;
// //     }
// //     try {
// //         const cart = await cartsManager.getCartById(cartId);
// //         if (!cart) {
// //             res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
// //             return;
// //         }
// //         res.status(200).send({ status: 'success', payload: cart });
// //     } catch (error) {
// //         res.status(500).send({ status: 'error', error: 'Error al obtener el carrito' });
// //     }
// // });

// //OBTENER CARRITO POR ID MEDIANTE POPULATE
// router.get('/:cid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const cart = await Cart.findById(cartId)
//         // const cart = await Cart.findById(cartId).populate('productsModel.product'); // Popula la propiedad 'products' con los productos completos
//         if (!cart) {
//             return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
//         }
//         res.json({ status: 'success', cart });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: 'error', message: 'Error al obtener el carrito' });
//     }
// });

// //CREAR NUEVO CARRITO VACIO:
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

// //AGREGAR PRODUCTO AL CARRITO:
// // router.post('/:cid/product/:pid', async (req, res) => {
// //     const cartId = req.params.cid;
// //     const productId = req.params.pid;
// //     const quantity = req.body.quantity;

// //     console.log('Cart ID:', cartId);//DEPURACION
// //     console.log('Product ID:', productId);//DEPURACION
// //     console.log(`Datos de producto a agregar: Carrito Id: ${cartId} ID producto: ${productId} Cantidad: ${quantity}`);

// //     if (!cartId || !productId || !quantity) {
// //         res.status(400).send({ error: 'ID de carrito , ID de producto o cantidad inválidos' });
// //         return;
// //     } else if (isNaN(quantity)) {
// //         res.status(400).send({ error: 'La cantidad debe ser un valor numérico' });
// //         return;
// //     }

// //     try {
// //         let cart = await cartsManager.addProductToCart(cartId, productId, quantity)
// //         console.log('Carrito después de la actualización:', cartsManager.getCartById(cartId));

// //         res.status(201).send({ message: 'Producto agregado al carrito', cart });
// //     } catch (error) {
// //         res.status(500).send({ error: 'Error al agregar el producto al carrito' });
// //     }

// // });

// router.delete('/:cid/products/:pid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const productId = req.params.pid;

//         // Busca el carrito por su ID
//         const cart = await Cart.findById(cartId);

//         if (!cart) {
//             return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
//         }

//         // Filtra y elimina el producto del array de productos en el carrito
//         cart.products = cart.products.filter((item) => item.product.toString() !== productId);

//         // Guarda el carrito actualizado
//         await cart.save();

//         res.json({ status: 'success', message: 'Producto eliminado del carrito' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
//     }
// });
// router.put('/:cid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const newProducts = req.body.products;

//         // Busca el carrito por su ID
//         const cart = await Cart.findById(cartId);

//         if (!cart) {
//             return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
//         }

//         // Actualiza el array de productos en el carrito con los nuevos productos
//         cart.products = newProducts;

//         // Guarda el carrito actualizado
//         await cart.save();

//         res.json({ status: 'success', message: 'Carrito actualizado' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: 'error', message: 'Error al actualizar el carrito' });
//     }
// });

// router.put('/:cid/products/:pid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const productId = req.params.pid;
//         const newQuantity = req.body.quantity;

//         const cart = await Cart.findById(cartId);

//         if (!cart) {
//             return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
//         }

//         const productIndex = cart.products.findIndex((item) => item.product.toString() === productId);

//         if (productIndex === -1) {
//             return res.status(404).send({ status: 'error', message: 'Producto no encontrado en el carrito' });
//         }

//         cart.products[productIndex].quantity = newQuantity;

//         await cart.save();

//         res.json({ status: 'success', message: 'Cantidad del producto actualizada en el carrito' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: 'error', message: 'Error al actualizar la cantidad del producto en el carrito' });
//     }
// });

// router.delete('/:cid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;

//         // Busca el carrito por su ID y elimina todos los productos
//         await Cart.findByIdAndUpdate(cartId, { products: [] });

//         res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
//     }
// });

// // router.post("/:cid/products/:pid", async (req, res) => {
// //     const { cid, pid } = req.params;
// //     const { quantity } = req.body;

// //     try {
// //         const cart = await Cart.findOne({ _id: cid });

// //         if (!cart) {
// //             return res.status(404).json({ message: "Carrito no encontrado" });
// //         }

// //         const existingProduct = cart.products.find(
// //             (product) => product.product.toString() === pid
// //         );

// //         if (existingProduct) {
// //             // Si el producto ya existe en el carrito, actualiza la cantidad
// //             const updatedCart = await cartsManager.modifyQuantity(
// //                 cid,
// //                 pid,
// //                 existingProduct.quantity + parseInt(quantity)
// //             );
// //             return res.json({ message: "Cantidad de producto actualizada", data: updatedCart });
// //         } else {
// //             // Si el producto no existe en el carrito, agrégalo
// //             const product = await Product.findById(pid);
// //             const savedCart = await cartsManager.addProductToCart(cid, pid, parseInt(quantity));
// //             return res.json({ message: "Producto agregado", data: savedCart });
// //         }
// //     } catch (error) {
// //         return res.status(500).json({ message: "Error interno del servidor", error });
// //     }
// // });

// // router.post('/:cid/products/:pid', async (req, res) => {
// //     // const cartId = req.params.cid;
// //     const cartId = "6518b3030b4bb755731f2cd0"
// //     const productId = req.params.pid;
// //     const quantity = req.body.quantity;
// //        // Registra la solicitud `POST` entrante
// //        console.log('Request:', req);

// //        // Registra el cuerpo de la solicitud `POST` entrante
// //        console.log('Body:', req.body);


// //     try {
// //         const updatedCart = await cartsManager.addProductToCart(cartId, productId, quantity);
// //         res.status(200).json(updatedCart);
// //     } catch (error) {
// //         res.status(500).json({ error: error.message });
// //     }
// // });
// // Simplificamos la solicitud POST
// router.post('/:cid/products/:pid', async (req, res) => {
//     try {
//         const cartId = req.params.cid;
//         const productId = req.params.pid;

//         const updatedCart = await cartsManager.addProductToCart(cartId, productId);

//         if (!updatedCart) {
//             return res.status(404).json({ status: 'error', message: 'Producto o carrito no encontrado' });
//         }

//         res.json({ status: 'success', message: 'Producto agregado al carrito' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: 'error', message: 'Error al agregar el producto al carrito' });
//     }
// });


// router.post("/:cid/products/:pid", async (req, res) => {
//     const { cid, pid, quantity } = req.params;
//     let cart = await Cart.findOne({ _id: cid });

//     if (cart) {
//         const productInCart = cart.products.find(product => product.product._id === pid);

//         if (productInCart) {
//             productInCart.quantity += parseInt(quantity);
//         } else {
//             const product = await Product.findById(pid);
//             cart.products.push({
//                 product: product._id,
//                 quantity: quantity,
//             });
//         }

//         const result = await cart.save();
//         return res.json({ message: "Producto agregado", data: result });
//     } else {
//         return res.status(404).json({ message: "Carrito no encontrado" });
//     }
// })

// router.post("/:cid/products/:pid", async (req, res) => {
//     const { cid, pid } = req.params;
//     const { quantity } = req.body; // Obtén la cantidad del cuerpo de la solicitud

//     try {
//         let cart = await Cart.findOne({ _id: cid });

//         if (cart) {
//             const productInCart = cart.products.find(product => product.product.toString() === pid);

//             if (productInCart) {
//                 // Si el producto ya existe en el carrito, suma la cantidad proporcionada
//                 productInCart.quantity += parseInt(quantity); 
//             } else {
//                 const product = await Product.findById(pid);
//                 cart.products.push({
//                     product: product._id,
//                     quantity: parseInt(quantity),
//                 });
//             }

//             const result = await cart.save();
//             return res.json({ message: "Producto agregado", data: result });
//         } else {
//             return res.status(404).json({ message: "Carrito no encontrado" });
//         }
//     } catch (error) {
//         return res.status(500).json({ message: "Error interno del servidor", error });
//     }
// });

// router.post("/:cid/products/:pid", async (req, res) => {
//     const { cid, pid } = req.params;
//     const { quantity } = req.body; // Obtén la cantidad del cuerpo de la solicitud

//     try {
//         const updatedCart = await cartsManager.addProductToCart(cid, pid, parseInt(quantity));

//         return res.json({ message: "Producto agregado", data: updatedCart });
//     } catch (error) {
//         return res.status(500).json({ message: "Error interno del servidor", error: error.message });
//     }
// });
// export default router;
import { Router } from 'express';
import Carts from '../dao/dbManagers/carts.manager.js';
import cartsModel from '../dao/models/carts.model.js';
import productsModel from '../dao/models/products.model.js';
import exp from 'constants';

const router = Router();
const cartsManager = new Carts();
const Cart = cartsModel;
const Product = productsModel;

// Simplificamos la solicitud POST
router.post('/:cid/products/:pid', async (req, res) => {

    try {
        console.log('Solicitud POST recibida en la ruta /:cid/products/:pid');

        const cartId = req.params.cid;
        const productId = req.params.pid;
        console.log('cartId:', cartId);
        console.log('productId:', productId);

        const updatedCart = await cartsManager.addProductToCart(cartId, productId);

        if (!updatedCart) {
            return res.status(404).json({ status: 'error', message: 'Producto o carrito no encontrado' });
        }

        res.json({ status: 'success', message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', message: 'Error al agregar el producto al carrito' });
    }
});



//OBTENER CARRITO POR ID MEDIANTE POPULATE
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId)
        // const cart = await Cart.findById(cartId).populate('productsModel.product'); // Popula la propiedad 'products' con los productos completos
        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', cart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', message: 'Error al obtener el carrito' });
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


router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Busca el carrito por su ID
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Filtra y elimina el producto del array de productos en el carrito
        cart.products = cart.products.filter((item) => item.product.toString() !== productId);

        // Guarda el carrito actualizado
        await cart.save();

        res.json({ status: 'success', message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito' });
    }
});
router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const newProducts = req.body.products;

        // Busca el carrito por su ID
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).send({ status: 'error', message: 'Carrito no encontrado' });
        }

        // Actualiza el array de productos en el carrito con los nuevos productos
        cart.products = newProducts;

        // Guarda el carrito actualizado
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

        // Busca el carrito por su ID y elimina todos los productos
        await Cart.findByIdAndUpdate(cartId, { products: [] });

        res.json({ status: 'success', message: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar todos los productos del carrito' });
    }
});
export default router;