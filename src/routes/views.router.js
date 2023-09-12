import express from 'express';
import ProductManager from '../productManager.js';

const router = express.Router();
const productCatalog = new ProductManager('products.json')

router.get('/', async (req, res) => {
    try {
        const products = await productCatalog.getProducts(); 
        res.render('home', { products }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productCatalog.getProducts();
        res.render('realTimeProducts', { products }); 
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos en tiempo real' });
    }
});
// ...

router.post('/realtimeproducts', async (req, res) => {
    const productData = req.body;

    try {
        const newProduct = await productCatalog.addProduct(productData);
        
        io.emit('updateProducts', await productCatalog.getProducts());

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto en tiempo real' });
    }
});

// ...

export default router;