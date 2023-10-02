import express from 'express';
import Products from '../dao/dbManagers/products.manager.js'
import { upload } from '../utils.js';
import productsModel from '../dao/models/products.model.js';
// import path from 'path';

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

// Ruta para agregar un nuevo producto
router.post('/', upload.single('thumbnail'), async (req, res) => {
    const productData = req.body;
    const thumbnailFile = req.file;

    try {
        if (thumbnailFile) {
            productData.thumbnail = thumbnailFile.filename;
        } else {
            productData.thumbnail = ''; // o productData.thumbnail = '';
        }

        const newProduct = await productCatalog.addProduct(productData);

        res.status(201).send(newProduct);
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar el producto' });
    }
});


router.delete('/:pid', async (req, res) => {//Borrar prod por ID
    const productId = req.params.pid;

    let result = await productsModel.findByIdAndDelete(productId);

    if (result === null) {
        return res.status(404).send({ message: 'Producto no encontrado' });
    } else {
        return res.status(202).send({ message: 'Producto eliminado con exito', data: result });
    }
});

router.put('/:pid', upload.array('thumbnail'), async (req, res) => {//Modificar un producto
    const productId = req.params.pid;
    if (!productId) {
        res.status(400).send({ error: 'Debe actualizar mediante un ID de producto' });
        return;
    }

    const updatedFields = req.body;

    try {
        const existingProduct = await productsModel.findById(productId);
        if (!existingProduct) {
            res.status(404).send({ error: 'Producto no encontrado' });
            return;
        }
        for (const key in updatedFields) {
            if (updatedFields.hasOwnProperty(key)) {
                existingProduct[key] = updatedFields[key];
            }
        }

        if (req.files && req.files.length > 0) {
            const imageUrls = req.files.map((file) => {
                return file.filename;
            });
            existingProduct.thumbnail = imageUrls;
        }
        const updatedProduct = await existingProduct.save();
        res.status(200).send({ message: 'Producto actualizado con éxito', product: updatedProduct });
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar el producto' });
    }
});

export default router;