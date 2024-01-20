import express from 'express';
import { upload } from '../utils.js';
import * as ProductsController from '../controllers/products.controller.js';
import { publicAccess } from '../middlewares/auth/auth.middlewares.js';

const router = express.Router();


router.get('/', ProductsController.getAll);
router.get('/:pid',  ProductsController.getProductById);
router.post('/', upload.single('thumbnail'), ProductsController.addProduct);
router.delete('/:pid', ProductsController.deleteProduct);
router.put('/:pid', upload.array('thumbnail'), ProductsController.updateProduct);
router.post('/mockingproducts', publicAccess, ProductsController.getMockProducts);//Desde el frontend en la ruta /api/mockingproducts

export default router;
