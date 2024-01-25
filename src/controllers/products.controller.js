import * as ProductsService from '../services/products.service.js';
import * as SessionsService from '../services/sessions.service.js';

async function getAll(req, res) {
    try {
        const products = await ProductsService.getAllProducts(req.query.limit);
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send({ error: 'Error al obtener productos' });
    }
}

async function getProductById(req, res) {
    const productId = req.params.pid;

    if (!productId) {
        res.status(400).send({ error: 'Debes ingresar un ID de producto válido' });
        return;
    }

    try {
        const product = await ProductsService.getProductById(productId);

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
        const userCookie = req.cookies.userCookie;
        const newProduct = await ProductsService.addProduct(productData, thumbnailFile, userCookie);

        res.status(201).send(newProduct);

    } catch (error) {
        console.error(error);

        if (error.name === 'AddProductError') {
            res.status(400).send({
                name: 'AddProductError',
                cause: error.cause,
                code: error.code,
            });
        } else {
            res.status(500).send({
                name: 'InternalError',
                cause: 'Error while creating product',
                code: error.code,
            });
        }
    }
};

async function deleteProduct(req, res) {
    const { pid } = req.params;
    const { id: userId, role: userRole } = req.session.user;

    try {
        const product = await ProductsService.getProductById(pid);
        if (!product) {
            return res.status(404).send({ message: 'Producto no encontrado' });
        }

        const { owner: ownerId } = product;
        const ownerDetails = await SessionsService.getUserById(ownerId);
        const { role: ownerRole } = ownerDetails;
        
        const result = await ProductsService.deleteProduct(pid, userId, userRole, ownerRole, ownerId);

        if (!result) {
            return res.status(404).send({ message: 'Producto no encontrado' });
        }
        return res.status(202).send({ message: 'Producto eliminado con éxito', data: result });
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
        const updatedProduct = await ProductsService.updateProduct(productId, updatedFields, req.files);

        res.status(200).send({ message: 'Producto actualizado con éxito', product: updatedProduct });
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar el producto' });
    }
}

async function getMockProducts(req, res) {
    try {
        const mockProducts = await ProductsService.generateMockProducts();
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