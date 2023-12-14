import express from 'express';
import { upload } from '../utils.js';
import { publicAccess, privateAccess, adminAccess } from '../middlewares/auth/auth.middlewares.js';
import * as ViewsController from '../controllers/views.controller.js';
import { addLogger } from '../utils/logger.js';

const router = express.Router();

router.get('/', privateAccess, ViewsController.getProductsQueries);
router.get('/carts/:cid', adminAccess, ViewsController.getAll);
router.get('/realtimeproducts', adminAccess, ViewsController.getRealTimeProducts);
router.post('/realtimeproducts', upload.single('thumbnail'), ViewsController.postRealTimeProducts);
router.delete('/realtimeproducts/:pid', ViewsController.deleteRealTimeProducts);
router.get('/products', privateAccess, ViewsController.getAllProducts);
router.get('/products/:pid', privateAccess, ViewsController.getProductById);
router.get('/carts', privateAccess, ViewsController.getCartDetails)
router.get('/chat', privateAccess, ViewsController.getChat);
router.get('/register', publicAccess, ViewsController.getRegister);
router.get('/login', publicAccess, ViewsController.getLogin);
router.get('/profile', privateAccess, ViewsController.getProfile);
router.get('/loggerTest', ViewsController.loggerTest);
router.get('/forgot-password', publicAccess, ViewsController.showForgotPassword);
router.get('/reset-password/:token', publicAccess, ViewsController.showResetPassword);


export default router;
