import express from 'express';
import Products from '../dao/dbManagers/products.manager.js';

const router = express.Router();
const productCatalog = new Products('products')

router.get('/', async (req, res) => {
    try {
        const products = await productCatalog.getAll();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productCatalog.getAll();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos en tiempo real' });
    }
});

router.post('/realtimeproducts', async (req, res) => {
    const productData = req.body;

    try {
        const newProduct = await productCatalog.addProduct(productData);

        socket.emit('updateProducts', await productCatalog.getAll());

        res.status(201).send(newProduct);
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar el producto en tiempo real' });
    }
});

router.delete('/realtimeproducts', async (req, res) => {
    const deleteProductId = parseInt(req.body.deleteProductId);
    console.log('Producto a eliminar (ID) recibido en el servidor:', deleteProductId);
    console.log(`ID is NaN: ${isNan(deleteProductId)}`)


    if (!deleteProductId || isNaN(deleteProductId)) {
        res.status(400).json({ error: 'ID de producto a eliminar inválido' });
        return;
    }

    try {
        await productCatalog.deleteProduct(deleteProductId);

        io.emit('updateProducts', await productCatalog.getProducts());

        res.status(200).json({ message: 'Producto eliminado con éxito' });
        console.log('Producto eliminado con éxito');
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
        console.error('Error al eliminar el producto:', error);

    }
});

export default router;