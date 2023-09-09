import express from 'express';
import ProductManager from '../productManager.js'
import upload from '../../utils.js';

const router = express.Router();
const productCatalog = new ProductManager('../db/products.json');

// Rutas para productos
router.get('/', async (req, res) => { //Consulta todos los productos
    const limit = req.query.limit;

    try {
        const products = await productCatalog.getProducts();

        if (limit) {
            res.json(products.slice(0, parseInt(limit))); // Establecer el límite de productos a mostrar
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/:pid', async (req, res) => {//Consulta productos por ID
    const productId = parseInt(req.params.pid);

    if (!productId || isNaN(productId)) {
        res.status(400).json({ error: 'ID inválido, debe ser un valor numérico' });
        return;
    }

    try {
        const product = await productCatalog.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

router.post('/', upload.array('thumbnail'), async (req, res) => {//Agregar producto
    const {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
    } = req.body;
    console.log(req.body);

    if (!title || !description || !code || !price || !stock || !category) {
        res.status(400).json({ error: 'Todos los campos son obligatorios' });
        return;
    }

    try {
        const imageUrls = req.files ? req.files.map((file) => file.filename) : [];

        const product = await productCatalog.addProduct({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail: imageUrls,
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {//Borrar prod por ID
    const productId = parseInt(req.params.pid);

    if (!productId || isNaN(productId)) {
        res.status(400).json({ error: 'El valor del ID debe ser numérico' });
        return;
    } try {
        await productCatalog.deleteProduct(productId);
        res.status(200).json({ message: 'Producto eliminado con éxito' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

router.put('/:pid', async (req, res) => {//Modificar un producto
    const productId = parseInt(req.params.pid);

    if (!productId || isNaN(productId)) {
        res.status(400).json({ error: 'ID del producto invalido' });
        return;
    }

    const updatedFields = req.body;

    try {
        await productCatalog.updateProduct(productId, updatedFields);
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar el producto' });
    }
});

export default router;