import express from 'express';
// import Products from '../dao/dbManagers/products.manager.js'
import { upload } from '../utils.js';
import * as ProductsController from '../controllers/products.controller.js';

const router = express.Router();


router.get('/', ProductsController.getAll);
router.get('/:pid', ProductsController.getProductById);
router.post('/', upload.single('thumbnail'), ProductsController.addProduct);
router.delete('/:pid', ProductsController.deleteProduct);
router.put('/:pid', upload.array('thumbnail'), ProductsController.updateProduct);

export default router;
