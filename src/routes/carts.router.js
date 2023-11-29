import { Router } from 'express';
import * as CartsController from '../controllers/carts.controller.js';
import { addLogger } from '../utils/logger.js';

const router = Router();

router.post('/:cid/products/:pid', addLogger, CartsController.addProductToCart);
router.get('/:cid', CartsController.getCartDetails);
router.post('/', CartsController.createCart);
router.delete("/:cid/products/:pid", CartsController.deleteProductFromCart);
router.put('/:cid', addLogger, CartsController.updateCart);
router.put('/:cid/products/:pid', addLogger, CartsController.updateProductQuantity);
router.delete('/:cid', CartsController.emptyCart);
router.post('/:cid/purchase', addLogger, CartsController.purchaseCart);

export default router;