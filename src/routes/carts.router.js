// import { Router } from 'express';
import Router from './router.js';
import Carts from '../dao/dbManagers/carts.manager.js';
import Users from '../dao/dbManagers/users.manager.js';
import { accessRoles, passportStrategiesEnum } from '../config/enums.js';

// const router = Router();
const cartsManager = new Carts();
const usersManager = new Users();

export default class CartsRouter extends Router {
    constructor() {
        super();
        this.cartsManager = new Carts();
    }

    init() {
        //Endpoints
        this.get('/:cid', [accessRoles.USER], passportStrategiesEnum.JWT, this.getCartDetails);
        this.post('/:cid/products/:pid', [accessRoles.USER], passportStrategiesEnum.JWT, this.addProductToCart);
        this.post('/', [accessRoles.USER], passportStrategiesEnum.JWT, this.save);
        this.delete('/:cid/products/:pid', [accessRoles.USER], passportStrategiesEnum.JWT, this.deleteProductFromCart);
        this.put('/:cid', [accessRoles.USER], passportStrategiesEnum.JWT, this.updateCart);
        this.put('/:cid/products/:pid', [accessRoles.USER], passportStrategiesEnum.JWT, this.updateProductQuantity);
        this.delete('/:cid', [accessRoles.USER], passportStrategiesEnum.JWT, this.emptyCart);
    }

    //LOGICA DE LLAMADO A MÉTODOS DEL MANAGER:

    //Obtener detalles del Carrito:
    getCartDetails = async (req, res) => {
        const cartId = req.params.cid;
        try {
            const cartDetails = await this.cartsManager.getCartDetails(cartId);
            res.sendSuccess(cartDetails);

        } catch (error) {
            console.error(error);
            res.sendServerError(error.message, 'Error al obtener el carrito');
        }
    }

    //Agregar Producto al Carrito:
    addProductToCart = async (req, res) => {
        const productId = req.params.pid;
        const user = req.user; // Usamos req.user para obtener el usuario autenticado
        const cartId = user.cart; // Obtiene el ID del carrito del usuario desde la sesión
        console.log(`Agregando al carrito con ID ${cartId} el producto con ID ${productId}. Usuario ${user.id}`);

        try {
            const updatedCart = await this.cartsManager.addProductToCart(cartId, productId);

            if (!updatedCart) {
                throw new Error('Producto o carrito no encontrado');
            }

            res.sendSuccess({ message: 'Producto agregado al carrito' });
        } catch (error) {
            console.error(error);
            res.sendServerError('Error al agregar el producto al carrito');
        }
    }

    //Crear carrito vacío
    save = async (req, res) => {
        try {
            const newCart = {
                products: [],
            };
            const createdCart = await this.cartsManager.save(newCart);
            res.sendSuccess(createdCart, 'Carrito creado con éxito');
        } catch (error) {
            res.sendServerError(error.message, 'Error al crear el carrito');
        }
    }

    //Eliminar Producto del Carrito
    deleteProductFromCart = async (req, res) => {
        const { cid, pid } = req.params;
        try {
            const result = await this.cartsManager.deleteProductFromCart(cid, pid);
            return res.sendSucces({ data: result }, 'Producto eliminado correctamente del carrito');
        } catch (error) {
            console.error(error);
            return res.sendServerError(error.message, "Error al eliminar el producto del carrito");
        }
    }

    //Actualizar Carrito
    updateCart = async (req, res) => {
        const cartId = req.params.cid;
        const newProducts = req.body.products;
        try {
            const updatedCart = await this.cartsManager.updateCart(cartId, newProducts);
            return res.sendSuccess({ message: 'Carrito actualizado', data: updatedCart });
        } catch (error) {
            console.error(error);
            return res.sendServerError({ message: 'Error al actualizar el carrito' });
        }
    }

    //Actualizar Cantidad de Producto en Carrito:
    updateProductQuantity = async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await this.cartsManager.updateProductQuantity(cartId, productId, newQuantity);
            return res.sendSuccess({ message: 'Cantidad del producto actualizada en el carrito', data: updatedCart });
        } catch (error) {
            console.error(error);
            return res.sendServerError({ message: 'Error al actualizar la cantidad del producto en el carrito' });
        }
    }

    // Vaciar Carrito:
    emptyCart = async (req, res) => {
        const cartId = req.params.cid;
        try {
            const result = await cartsManager.emptyCart(cartId);
            return res.sendSuccess({ message: 'Todos los productos eliminados del carrito', data: result });
        } catch (error) {
            console.error(error);
            return res.sendServerError({ message: 'Error al eliminar todos los productos del carrito' });
        }
    }
}
// router.post('/:cid/products/:pid', async (req, res) => {
//     console.log('Solicitud POST recibida en la ruta /:cid/products/:pid');
//     const productId = req.params.pid;
//     const user = req.session.user; // Obtiene el usuario actual
//     const cartId =  user.cart; // Obtiene el id del carrito del usuario
//     console.log(`Agregando al carrito con id ${cartId} el producto ${productId}. Usuario ${user.id}`)

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