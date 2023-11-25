import usersModel from '../dao/mongo/models/users.model.js';
import { productsRepository } from '../repositories/index.js';
import { generateMockProduct } from '../utils.js';
import { generateProductErrorInfo } from '../middlewares/errors/info.js';
import CustomError from '../middlewares/errors/CustomError.js';
import EErrors from '../middlewares/errors/enums.js';

async function getAll(req, res) {
    const { limit } = req.query;

    try {
        const products = await productsRepository.getAll(limit);
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send({ error: 'Error al obtener productos' });
    }
}

async function getProductById(req, res) {
    const productId = parseInt(req.params.pid);

    if (!productId || isNaN(productId)) {
        res.status(400).send({ error: 'ID inválido, debe ser un valor numérico' });
        return;
    }

    try {
        const product = await productsRepository.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).send({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener producto' });
    }
}

async function addProduct(req, res) {
    const productData = req.body;
    const thumbnailFile = req.file;

        if (!productData.title || !productData.price) {
            throw CustomError.createError({
                name: 'ProductError',
                cause: generateProductErrorInfo(productData),
                message: 'Error trying to create product',
                code: EErrors.INVALID_TYPER_ERROR
            });
        }

        if (thumbnailFile) {
            productData.thumbnail = thumbnailFile.filename;
        } else {
            productData.thumbnail = '';
        }

        const newProduct = await productsRepository.addProduct(productData);

        res.status(201).send(newProduct);
}

async function deleteProduct(req, res) {
    const productId = req.params.pid;

    try {
        const result = await productsRepository.deleteProduct(productId);

        if (!result) {
            return res.status(404).send({ message: 'Producto no encontrado' });
        } else {
            return res.status(202).send({ message: 'Producto eliminado con éxito', data: result });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', message: 'Error al eliminar el producto' });
    }
}

async function updateProduct(req, res) {
    const productId = req.params.pid;

    if (!productId) {
        res.status(400).send({ error: 'Debe actualizar mediante un ID de producto' });
        return;
    }

    const updatedFields = req.body;

    try {
        const updatedProduct = await productsRepository.updateProduct(productId, updatedFields);

        if (!updatedProduct) {
            res.status(404).send({ error: 'Producto no encontrado' });
            return;
        }

        if (req.files && req.files.length > 0) {
            const imageUrls = req.files.map((file) => {
                return file.filename;
            });
            updatedProduct.thumbnail = imageUrls;
        }

        res.status(200).send({ message: 'Producto actualizado con éxito', product: updatedProduct });
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar el producto' });
    }
}

async function getMockProducts(req, res) {
    try {
        let mockProducts = []
        for (let i = 0; i < 100; i++) {
            mockProducts.push(generateMockProduct())
        }
        res.send({ status: 'success', payload: mockProducts })
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', message: 'Error al obtener mockingproducts' });
    }
};

export {
    getAll,
    getProductById,
    addProduct,
    deleteProduct,
    updateProduct,
    getMockProducts
};  
