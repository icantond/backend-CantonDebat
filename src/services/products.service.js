
import { productsRepository, usersRepository } from '../repositories/index.js';
import { generateMockProduct } from '../utils.js';
import { generateProductErrorInfo } from '../middlewares/errors/info.js';
import CustomError from '../middlewares/errors/CustomError.js';
import EErrors from '../middlewares/errors/enums.js';
import jwt from 'jsonwebtoken';
import configs from '../config/config.js';
import transport from '../config/nodemailer.config.js';


async function getAllProducts(limit) {
    return await productsRepository.getAll(limit);
}

async function getProductById(productId) {
    return await productsRepository.getProductById(productId);
}

async function addProduct(productData, thumbnailFile, userCookie) {
    if (!productData.title || !productData.price || !productData.description || !productData.stock || !productData.code || !productData.category) {
        throw CustomError.createError({
            name: 'AddProductError',
            cause: generateProductErrorInfo(productData),
            message: 'Error trying to create product',
            code: EErrors.INVALID_TYPER_ERROR
        });
    }

    if (thumbnailFile) {
        productData.thumbnail = thumbnailFile.filename;
    } else {
        productData.thumbnail = '';
    };

    const decodedToken = jwt.verify(userCookie, configs.jwtKey);

    if (!decodedToken || !decodedToken.id) {
        throw CustomError.createError({
            name: 'AuthenticationError',
            message: 'Invalid or missing user authentication token',
            code: EErrors.UNAUTHORIZED_ERROR
        });
    }

    productData.owner = decodedToken.id;

    return await productsRepository.addProduct(productData);
}

async function deleteProduct(productId, userId, userRole, ownerRole, ownerId) {
    const product = await productsRepository.getProductById(productId);

    if (!product) {
        return { error: 'Producto no encontrado' };
    }

    if (userRole === 'premium' && product.owner !== userId) {
        return { error: 'No tienes permisos para eliminar este producto' };
    }

    const deletedProduct = await productsRepository.delete(productId); 
    
    if (ownerRole === 'premium') {
        console.log('Sending product deletion email...');

        await sendProductDeletionEmail(ownerId, product.title);
    }

    return deletedProduct;
}

async function sendProductDeletionEmail(ownerId, productName) {
    console.log(`attempting to send deletion email to userID: ${ownerId}`)
    const owner = await usersRepository.getUserById(ownerId);

    if (!owner || owner.role !== 'premium') {
        console.log('User not found or not premium. Skipping email.');
        return; // Solo envía el correo si el owner es premium
    }

    const mailOptions = {
        from: configs.nodemailerUser,
        to: owner.email,
        subject: 'Producto Eliminado',
        text: `El producto "${productName}" ha sido eliminado de tu cuenta premium.`,
    };

    try {
        await transport.sendMail(mailOptions);  
        console.log(`Correo enviado a ${owner.email} sobre la eliminación del producto`);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
}

async function updateProduct(productId, updatedFields, files) {
    const updatedProduct = await productsRepository.updateProduct(productId, updatedFields);

    if (!updatedProduct) {
        return null;
    }

    if (files && files.length > 0) {
        const imageUrls = files.map((file) => {
            return file.filename;
        });
        updatedProduct.thumbnail = imageUrls;
    }

    return updatedProduct;
}

async function generateMockProducts() {
    let mockProducts = []
    for (let i = 0; i < 100; i++) {
        mockProducts.push(generateMockProduct())
    }
    return mockProducts;
}

async function getCategories() {
    return await productsRepository.getCategories();
};

async function getProductsByQuery(queryObj, sortOptions, skip, limit) {
    return await productsRepository.getProductsByQuery(queryObj, sortOptions, skip, limit);
};

async function countProducts(queryObj) {
    return await productsRepository.countProducts(queryObj);
};

export {
    getAllProducts,
    getProductById,
    addProduct,
    deleteProduct,
    updateProduct,
    generateMockProducts,
    getCategories,
    getProductsByQuery,
    countProducts
};