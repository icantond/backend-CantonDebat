import express from 'express';
import Products from '../dao/dbManagers/products.manager.js'
import { upload } from '../utils.js';
import productsModel from '../dao/models/products.model.js';

const router = express.Router();
const productCatalog = new Products();

// Rutas para productos
router.get('/', async (req, res) => { //Consulta todos los productos
    const limit = req.query.limit;

    try {
        const products = await productCatalog.getAll();


            if (limit) {
                res.json(products.slice(0, parseInt(limit))); // Establecer el límite de productos a mostrar
            } else {
                res.json(products);
            }
        // }
    } catch (error) {
        console.error('Error al obtener productos:', error);// DEPURACION
        res.status(500).send({ error: 'Error al obtener productos' });


    }
});

router.get('/:pid', async (req, res) => {//Consulta productos por ID
    const productId = parseInt(req.params.pid);

    if (!productId || isNaN(productId)) {
        res.status(400).send({ error: 'ID inválido, debe ser un valor numérico' });
        return;
    }

    try {
        const product = await productCatalog.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).send({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener producto' });
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
    } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        res.status(400).send({ error: 'Todos los campos son obligatorios' });
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

        io.emit('updateProducts', await productCatalog.getProducts());

        res.status(201).send(product);
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {//Borrar prod por ID
    const productId = parseInt(req.params.pid);

    if (!productId || isNaN(productId)) {
        res.status(400).send({ error: 'El valor del ID debe ser numérico' });
        return;
    } try {
        await productCatalog.deleteProduct(productId);

        io.emit('updateProducts', await productCatalog.getProducts());

        res.status(200).send({ message: 'Producto eliminado con éxito' })
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar el producto' });
    }
});

router.put('/:pid', upload.array('thumbnail'), async (req, res) => {//Modificar un producto
    const productId = parseInt(req.params.pid);

    if (!productId || isNaN(productId)) {
        res.status(400).send({ error: 'ID del producto invalido' });
        return;
    }

    const updatedFields = req.body;

    if (req.files && req.files.length > 0) {
        const imageUrls = req.files.map((file) => {
            return file.filename; // Solo guarda el nombre del archivo
        });

        updatedFields.thumbnail = imageUrls; // Asigna los nombres de archivo de las imágenes
    }

    try {
        const updatedProduct = await productsModel.findByIdAndUpdate(productId, updatedFields, { new: true });
        res.status(200).send({ message: 'Producto actualizado con éxito', product: updatedProduct });
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar el producto' });
    }
});

export default router;