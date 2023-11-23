import { Router } from 'express';
import * as CartsController from '../controllers/carts.controller.js';

const router = Router();

router.post('/:cid/products/:pid', CartsController.addProductToCart);
router.get('/:cid', CartsController.getCartDetails);
router.post('/', CartsController.createCart);
router.delete("/:cid/products/:pid", CartsController.deleteProductFromCart);
router.put('/:cid', CartsController.updateCart);
router.put('/:cid/products/:pid', CartsController.updateProductQuantity);
router.delete('/:cid', CartsController.emptyCart);
router.post('/:cid/purchase', CartsController.purchaseCart);

export default router;