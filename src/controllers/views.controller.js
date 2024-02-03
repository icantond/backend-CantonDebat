import EErrors from '../middlewares/errors/enums.js';
import * as viewsService from '../services/views.service.js';
import * as productsService from '../services/products.service.js';
import * as usersService from '../services/users.service.js';
import jwt from 'jsonwebtoken';
import configs from '../config/config.js';
import moment from 'moment';

const host = configs.devHost;

async function getProductsQueries(req, res) {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 15;
    let sort = req.query.sort || '';
    let query = req.query.query || '';
    let category = req.query.category || '';
    let available = req.query.available || '';

    const categories = await productsService.getCategories();
    const skip = (page - 1) * limit;

    try {
        const sortOptions = {};
        if (sort === 'asc' || sort === 'desc') {
            sortOptions.price = sort; 
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

        const products = await productsService.getProductsByQuery(queryObj, sortOptions, skip, limit);
        const totalItems = await productsService.countProducts(queryObj);

        const totalPages = Math.ceil(totalItems / limit);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        const currentPage = page;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            const isCurrentPage = i === currentPage;
            const link = isCurrentPage ? null : `${configs.devHost}/?page=${i}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&available=${available}`; // Reemplaza con tu ruta adecuada
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
            prevLink: hasPrevPage ? `${configs.devHost}/?page=${prevPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null,
            nextLink: hasNextPage ? `${configs.devHost}/?page=${nextPage}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null,
            host
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

async function getAllCarts(req, res) {
    const ownerId = req.session.user.id;
    const userRole = req.session.user.role;

    try {
        const data = await viewsService.getAllCarts(ownerId, userRole);
        res.render('realTimeProducts', {...data, host});
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error al obtener productos en tiempo real' });
    }
};

async function getRealTimeProducts(req, res) {
    const ownerId = req.session.user.id;
    const userRole = req.session.user.role;

    try {
        const data = await viewsService.getRealTimeProducts(ownerId, userRole);
        res.render('realTimeProducts', {...data, host});
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error al obtener productos en tiempo real' });
    }
};

async function postRealTimeProducts(req, res) {
    const productData = req.body;
    const thumbnailFile = req.file;

    try {
        const newProduct = await viewsService.postRealTimeProducts(productData, thumbnailFile);

        res.status(201).send(newProduct);
    } catch (error) {
        res.status(500).send({ error: error.message || 'Error al agregar el producto en tiempo real' });
    }
};

async function deleteRealTimeProducts(req, res) {
    const deleteProductId = parseInt(req.body.deleteProductId);

    if (!deleteProductId || isNaN(deleteProductId)) {
        res.status(400).json({ error: 'ID de producto a eliminar inválido' });
        return;
    }

    try {
        const result = await viewsService.deleteRealTimeProducts(deleteProductId);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error al eliminar el producto' });
    }
};

async function getAllProducts(req, res) {
    try {
        const user = req.session.user;
        const data = await viewsService.getAllProducts(user);
        res.render('products', {...data, host});
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message || 'Error al obtener la lista de productos' });
    }
};

async function getProductById(req, res) {
    const productId = req.params.pid;

    try {
        const data = await viewsService.getProductById(productId);
        res.render('productdetail', {data});
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message || 'Error al obtener el producto' });
    }
};

async function getCartDetails(req, res) {
    const cartId = req.session.user.cart;
    try {
        const cart = await viewsService.getCartDetails(cartId);
        res.render('carts', {...cart, host});
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message || 'Error al obtener el carrito' });
    }
};

async function getChat (req, res) {
    res.render('chat', {host});
};

async function getRegister (req, res) {
    res.render('register', {host});
};

async function getLogin (req, res) {
    res.render('login', {host});
};

async function getProfile (req, res) {
    res.render('profile', {
        user: req.session.user,
        host
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
    res.render('forgot', host);
};

const showResetPassword = async (req, res) => {
    const token = req.params.token;

    try {
        const decodedToken = jwt.verify(token, configs.jwtKey);

        if (decodedToken.exp <= moment().unix()) {
            console.log('Token expirado');
            return res.redirect('/forgot-password');
        }

        res.render('reset', { token , host});
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log('Token expirado');
            return res.redirect('/forgot-password');
        }

        console.error('Error al verificar el token:', error);
        res.status(500).send('Error interno del servidor');
    }
};

const getRoles = async (req, res) => {
    const users = await usersService.getAllUsers();
    const usersDetails = users.map(user => {
        return {
            name: user.first_name + ' ' + user.last_name,
            id: user._id,
            email: user.email,
            role: user.role
        };
    })
    res.render('roles', { usersDetails, host });
}

export {
    getProductsQueries,
    getAllCarts,
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
    showResetPassword, 
    getRoles
};