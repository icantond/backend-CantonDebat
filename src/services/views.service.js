import { productsRepository, cartsRepository } from '../repositories/index.js';
import configs from '../config/config.js';

async function getProductsQueries(page, limit, sort, query, category, available) {
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
            queryObj.available = available;
        }

        const products = await productsRepository.getProductsQueries(queryObj, sortOptions, skip, limit);
        const totalItems = await productsRepository.countDocuments(queryObj);
        const totalPages = Math.ceil(totalItems / limit);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        const currentPage = page;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            const isCurrentPage = i === currentPage;
            const link = isCurrentPage ? null : `${configs.devHost}/?page=${i}&limit=${limit}&sort=${sort}&query=${query}&category=${category}&available=${available}`;
            pageNumbers.push({ page: i, link, isCurrentPage });
        }

        return {
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
        };
    } catch (error) {
        console.error(error);
        throw new Error('Error interno del servidor');
    }
};
async function getAllCarts(ownerId, userRole) {
    try {
        const products = await productsRepository.getAll();
        const productOwner = products.owner;
        return { products, owner: ownerId, productOwner, userRole };
    } catch (error) {
        throw new Error('Error al obtener productos en tiempo real');
    }
}

async function getRealTimeProducts(ownerId, userRole) {
    try {
        const products = await productsRepository.getAll();
        return { products, owner: ownerId, userRole };
    } catch (error) {
        throw new Error('Error al obtener productos en tiempo real');
    }
}

async function postRealTimeProducts(productData, thumbnailFile) {
    try {
        if (thumbnailFile) {
            productData.thumbnail = thumbnailFile.filename;
        } else {
            productData.thumbnail = '';
        }

        const newProduct = await productsRepository.addProduct(productData);

        // Emitir el evento a través de socket.io
        socket.emit('updateProducts', await productsRepository.getAll());

        return newProduct;
    } catch (error) {
        throw new Error('Error al agregar el producto en tiempo real');
    }
}

async function deleteRealTimeProducts(deleteProductId) {
    if (!deleteProductId || isNaN(deleteProductId)) {
        throw new Error('ID de producto a eliminar inválido');
    }

    try {
        await productsRepository.delete(deleteProductId);

        // Emitir el evento a través de socket.io
        io.emit('updateProducts', await productsRepository.getAll());

        return { message: 'Producto eliminado con éxito' };
    } catch (error) {
        throw new Error('Error al eliminar el producto');
    }
}

async function getAllProducts() {
    try {
        const products = await productsRepository.getAll();
        const user = req.session.user || {};
        const userCartId = user.cart;

        return { products, userCartId, user };
    } catch (error) {
        throw new Error('Error al obtener la lista de productos');
    }
}

async function getProductById(productId) {
    try {
        const product = await productsRepository.getProductById(productId);
        const productData = {
            title: product.title,
            category: product.category,
            price: product.price,
            _id: product._id,
            thumbnail: product.thumbnail,
        };
        return { productData };
    } catch (error) {
        throw new Error('Error al obtener el producto');
    }
}

async function getCartDetails(userId) {
    try {
        const userCartId = (await cartsRepository.getUserCart(userId))._id;

        const cartItems = await cartsRepository.getCartDetails(userCartId);

        cartItems.products.forEach((item) => {
            item.totalPrice = item.quantity * item.product.price;
        });

        cartItems.cartTotal = cartItems.products.reduce((total, item) => {
            return total + item.totalPrice;
        }, 0);

        return { cartItems, userCartId };
    } catch (error) {
        throw new Error('Error al obtener detalles del carrito');
    }
}

export {
    getProductsQueries,
    getAllCarts,
    getRealTimeProducts,
    postRealTimeProducts,
    deleteRealTimeProducts,
    getAllProducts,
    getProductById,
    getCartDetails
};
