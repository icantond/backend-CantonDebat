import express from 'express';
import Products from '../dao/dbManagers/products.manager.js';
import productsModel from '../dao/models/products.model.js';
import { upload } from '../utils.js';
import Carts from '../dao/dbManagers/carts.manager.js';

const router = express.Router();
const productCatalog = new Products('products')
const cartManager = new Carts('carts');

router.get('/', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 15; // Cambiamos el valor predeterminado a 15
    let sort = req.query.sort || '';
    let query = req.query.query || '';
    let category = req.query.category || '';
    let available = req.query.available || '';

    const categories = await productCatalog.getCategories();

    const skip = (page - 1) * limit;

    try {
        const sortOptions = {};
        if (sort === 'asc' || sort === 'desc') {
            sortOptions.price = sort; // Ordenar por precio ascendente o descendente
        }

        const queryObj = {};
        if (query) {
            queryObj.title = { $regex: new RegExp(query, 'i') };
        }
        if (category) {
            queryObj.category = category; // Filtrar por categoría
        }
        if (available) {
            queryObj.available = available; // Filtrar por disponibilidad
        }

        const products = await productsModel
            .find(queryObj)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();

        const totalItems = await productsModel.countDocuments(queryObj);

        const totalPages = Math.ceil(totalItems / limit);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        const currentPage = page; // Obtén la página actual

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            const isCurrentPage = i === currentPage;
            const link = isCurrentPage ? null : `http://localhost:8080/?page=${i}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&available=${available}`; // Reemplaza con tu ruta adecuada
            pageNumbers.push({ page: i, link, isCurrentPage });
        }

        res.render('home', {
            products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            pageNumbers,
            categories,
            prevLink: hasPrevPage ? `http://localhost:8080/?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null,
            nextLink: hasNextPage ? `http://localhost:8080/?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productCatalog.getRealTimeProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos en tiempo real' });
    }
});


router.post('/realtimeproducts', upload.single('thumbnail'), async (req, res) => {
    const productData = req.body;
    const thumbnailFile = req.file;

    try {
        if (thumbnailFile) {
            // productData.thumbnail = `${thumbnailFile.filename}${path.extname(thumbnailFile.originalname).toLowerCase()}`;
            productData.thumbnail = thumbnailFile.filename;
        } else {

            productData.thumbnail = ''; // o productData.thumbnail = '';
        }

        const newProduct = await productCatalog.addProduct(productData);

        socket.emit('updateProducts', await productCatalog.getRealTimeProducts());

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

router.get('/products', async (req, res) => {
    try {
        const products = await productCatalog.getAll();
        const carts = await cartManager.getAll();
        // Renderizar la vista 'products' y pasar los productos como datos
        res.render('products', { products, carts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener la lista de productos' });
    }
});


export default router;