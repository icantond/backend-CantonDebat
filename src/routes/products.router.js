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

router.post('/', upload.array('thumbnail', 1), async (req, res) => {
    console.log('req.file:', req.file); // Verifica que req.file contenga la información del archivo
    console.log('req.body:', req.body);
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
        const thumbnailFiles = req.files; // Obtener la lista de archivos de imagen
        console.log('thumbnailFiles:', thumbnailFiles); // Verifica que thumbnailFiles tenga los archivos correctamente

        const thumbnailPaths = thumbnailFiles.map((file) => `/static/img/${file.filename}`); // Crear la lista de rutas de imágenes
        console.log('thumbnailPaths:', thumbnailPaths); // Verifica que thumbnailPaths esté configurado correctamente

        const product = await productCatalog.addProduct({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnail: thumbnailPaths,
        });

        // socket.emit('updateProducts', await productCatalog.getProducts());

        res.status(201).send(product);
    } catch (error) {
        console.error('Error en la ruta POST:', error);
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