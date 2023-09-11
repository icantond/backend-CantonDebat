import express from 'express';
import ProductManager from '../productManager.js';

const router = express.Router();
const productCatalog = new ProductManager('products.json')

router.get('/', async (req, res) =>{
    try {
        const products = await productCatalog.getProducts(); // Obtén todos los productos desde tu gestor de productos
        res.render('home', { products }); // Pasa la lista de productos a la vista "home"
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }})

export default router;