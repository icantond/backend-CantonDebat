import productsModel from '../dao/mongo/models/products.model.js';
import EErrors from '../middlewares/errors/enums.js';
import { cartsRepository, productsRepository } from '../repositories/index.js';
import jwt from 'jsonwebtoken';
import configs from '../config/config.js';
// import router from '../routes/views.router.js';


async function getProductsQueries(req, res) {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 15;
    let sort = req.query.sort || '';
    let query = req.query.query || '';
    let category = req.query.category || '';
    let available = req.query.available || '';

    const categories = await productsRepository.getCategories();

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
};

async function getAll(req, res) {
    try {
        const products = await productsRepository.getAll();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos en tiempo real' });
    }
};

async function getRealTimeProducts (req, res) {
    try {
        const products = await productsRepository.getAll();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos en tiempo real' });
    }

}

async function postRealTimeProducts (req, res) {
    const productData = req.body;
    const thumbnailFile = req.file;

    try {
        if (thumbnailFile) {
            productData.thumbnail = thumbnailFile.filename;
        } else {

            productData.thumbnail = '';
        }

        const newProduct = await productsRepository.addProduct(productData);

        socket.emit('updateProducts', await productsRepository.getAll());

        res.status(201).send(newProduct);
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar el producto en tiempo real' });
    }
};

async function deleteRealTimeProducts (req, res) {
    const deleteProductId = parseInt(req.body.deleteProductId);
    console.log('Producto a eliminar (ID) recibido en el servidor:', deleteProductId);
    console.log(`ID is NaN: ${isNan(deleteProductId)}`)


    if (!deleteProductId || isNaN(deleteProductId)) {
        res.status(400).json({ error: 'ID de producto a eliminar inválido' });
        return;
    }

    try {
        await productsRepository.delete(deleteProductId);

        io.emit('updateProducts', await productsRepository.getAll());

        res.status(200).json({ message: 'Producto eliminado con éxito' });
        console.log('Producto eliminado con éxito');
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
        console.error('Error al eliminar el producto:', error);

    }
};

async function getAllProducts (req, res) {
    try {
        const products = await productsRepository.getAll();
        // const carts = await cartsRepository.getAll();
        const user = req.session.user || {};
        const userCartId = user.cart;
        console.log('usuario: ', user, 'cartId:', userCartId)

        res.render('products', { products, userCartId, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al obtener la lista de productos' });
    }
};

async function getProductById (req, res) {
    try {
        const pid = await productsRepository.getProductById(req.params.pid);
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
};

async function getCartDetails (req, res) {
    try {
        const user = req.session.user || {};
        const userCartId = user.cart;
        console.log('usuario: ', user, 'cartId:', userCartId)
        
        const cartItems = await cartsRepository.getCartDetails(userCartId);
        console.log(`trabajando con usuario ${user.email},  id ${user.id} en carrito ID ${userCartId}`);
        

        cartItems.products.forEach((item) => {
            item.totalPrice = item.quantity * item.product.price;
        });

        cartItems.cartTotal = cartItems.products.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);

        res.render('carts', { cartItems, userCartId });
    } catch (error) {

    }
};

async function getChat (req, res) {
    res.render('chat');
};

async function getRegister (req, res) {
    res.render('register');
};

async function getLogin (req, res) {
    res.render('login');
};

async function getProfile (req, res) {
    res.render('profile', {
        user: req.session.user
    });
};

async function loggerTest(req, res) {
    req.logger.fatal('Test log - fatal');
    req.logger.error('Test log - error');
    req.logger.warn('Test log - warn');
    req.logger.info('Test log - info');
    req.logger.http('Test log - http');
    req.logger.debug('Test log - debug');

    try {
        throw new Error('Test error');
    } catch (error) {
        req.logger.error(`Error during loggerTest: ${error.message}`);
        res.status(500).json({
            status: 'error',
            error: 'InternalError',
            description: 'Error during loggerTest',
            code: EErrors.INTERNAL_ERROR,
        });
    }
}

const showForgotPassword = (req, res) => {
    res.render('forgot');
};

const showResetPassword = async (req, res) => {
    const token = req.params.token;
    
    res.render('reset', { token });
};

export {
    getProductsQueries,
    getAll,
    getRealTimeProducts,
    postRealTimeProducts,
    deleteRealTimeProducts,
    getAllProducts,
    getProductById,
    getCartDetails,
    getChat,
    getRegister,
    getLogin,
    getProfile,
    loggerTest,
    showForgotPassword,
    showResetPassword
};