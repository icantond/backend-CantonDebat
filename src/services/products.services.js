import ProductsManager from '../dao/dbManagers/products.manager.js';

const productsManager = new ProductsManager();

async function getAllProducts(limit) {
    try {
        const products = await productsManager.getAll();

        if (limit) {
            return products.slice(0, parseInt(limit));
        } else {
            return products;
        }
    } catch (error) {
        throw error;
    }
}

async function getProductById(productId) {
    try {
        const product = await productsManager.getProductById(productId);
        return product;
    } catch (error) {
        throw error;
    }
}

async function addProduct(productData) {
    try {
        const newProduct = await productsManager.addProduct(productData);
        return newProduct;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('El código del producto ya existe en la base de datos.');
        } else {
            throw error;
        }
    }
}

async function deleteProduct(productId) {
    try {
        const result = await productsManager.delete(productId);
        return result;
    } catch (error) {
        throw error;
    }
}

async function updateProduct(productId, updatedFields) {
    try {
        const updatedProduct = await productsManager.update(productId, updatedFields);
        return updatedProduct;
    } catch (error) {
        throw error;
    }
}

export {
    getAllProducts,
    getProductById,
    addProduct,
    deleteProduct,
    updateProduct
};
