import express from 'express';
import Products from '../dao/dbManagers/products.manager.js';
import productsModel from '../dao/models/products.model.js';
import { upload } from '../utils.js';
import Carts from '../dao/dbManagers/carts.manager.js';

const router = express.Router();
const productsManager = new Products('products')
const cartManager = new Carts('carts');

//MANEJO DE VISTAS DE USUARIOS:
//Middleware para manejar las vistas privadas y sus correspondientes permisos:
const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
}

const adminAccess = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.redirect('/');
    }
    next();
}

router.get('/', privateAccess, async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 15;
    let sort = req.query.sort || '';
    let query = req.query.query || '';
    let category = req.query.category || '';
    let available = req.query.available || '';

    const categories = await productsManager.getCategories();

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
            queryObj.category = category;
        }
        if (available) {
            queryObj.available = available; ad
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
        const currentPage = page;

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

router.get('/realtimeproducts', adminAccess, async (req, res) => {
    try {
        const products = await productsManager.getRealTimeProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos en tiempo real' });
    }
});

//ESTAS VAN EN PRODUCTS.ROUTER?

router.post('/realtimeproducts', upload.single('thumbnail'), async (req, res) => {
    const productData = req.body;
    const thumbnailFile = req.file;

    try {
        if (thumbnailFile) {
            productData.thumbnail = thumbnailFile.filename;
        } else {

            productData.thumbnail = '';
        }

        const newProduct = await productsManager.addProduct(productData);

        socket.emit('updateProducts', await productsManager.getRealTimeProducts());

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
        await productsManager.deleteProduct(deleteProductId);

        io.emit('updateProducts', await productsManager.getProducts());

        res.status(200).json({ message: 'Producto eliminado con éxito' });
        console.log('Producto eliminado con éxito');
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
        console.error('Error al eliminar el producto:', error);

    }
});

router.get('/products', privateAccess, async (req, res) => {
    try {
        const products = await productsManager.getAll();
        const carts = await cartManager.getAll();
        const user = req.session.user || {};

        res.render('products', { products, carts, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener la lista de productos' });
    }
});

router.get('/products/:pid', privateAccess, async (req, res) => {
    try {
        const pid = await productsManager.getProductById(req.params.pid);
        const productData = {
            title: pid.title,
            category: pid.category,
            price: pid.price,
            _id: pid._id,
            thumbnail: pid.thumbnail,
        };
        console.log('renderizando vista product id: ', productData);
        res.render('productdetail', { productData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener el producto' });
    }
});

router.get('/carts', privateAccess, async (req, res) => {
    try {
        const cartId = '6518b3030b4bb755731f2cd0';
        const cartItems = await cartManager.getCartDetails(cartId);

        cartItems.products.forEach((item) => {
            item.totalPrice = item.quantity * item.product.price;
        });

        cartItems.cartTotal = cartItems.products.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);

        res.render('carts', { cartItems });
    } catch (error) {

    }
})

router.get('/chat', (req, res) => {
    res.render('chat');
});


//Rutas para renderizacion de las vistas

//registro
router.get('/register', publicAccess, (req, res) => {
    res.render('register');
});

//login
router.get('/login', publicAccess, (req, res) => {
    res.render('login');
});

//perfil de usuario (PRIVADA)
router.get('/profile', privateAccess, (req, res) => {
    console.log('Usuario actual: ', req.session.user.email, '. Rol: ', req.session.user.role);

    res.render('profile', {
        user: req.session.user
    });
});
export default router;