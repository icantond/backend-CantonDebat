import { productsRepository } from '../repositories/index.js';

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

    try {
        if (thumbnailFile) {
            productData.thumbnail = thumbnailFile.filename;
        } else {
            productData.thumbnail = '';
        }

        const newProduct = await productsRepository.addProduct(productData);

        res.status(201).send(newProduct);
    } catch (error) {
        res.status(500).send({ error: 'Error al agregar el producto' });
    }
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

export {
    getAll,
    getProductById,
    addProduct,
    deleteProduct,
    updateProduct
};
