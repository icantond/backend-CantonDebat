import * as ProductsService from '../services/products.service.js';

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
    console.log(`ProductId: ${productId}`)

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
    const productId = req.params.pid;

    try {
        const result = await ProductsService.deleteProduct(productId, req.session.user.id, req.session.user.role);

        if (!result) {
            res.status(404).send({ message: 'Producto no encontrado' });
        } else {
            res.status(202).send({ message: 'Producto eliminado con éxito', data: result });
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

// import { productsRepository } from '../repositories/index.js';
// import { generateMockProduct } from '../utils.js';
// import { generateProductErrorInfo } from '../middlewares/errors/info.js';
// import CustomError from '../middlewares/errors/CustomError.js';
// import EErrors from '../middlewares/errors/enums.js';
// import jwt from 'jsonwebtoken';
// import configs from '../config/config.js';

// async function getAll(req, res) {
//     const { limit } = req.query;

//     try {
//         const products = await productsRepository.getAll(limit);
//         res.json(products);
//     } catch (error) {
//         console.error('Error al obtener productos:', error);
//         res.status(500).send({ error: 'Error al obtener productos' });
//     }
// }

// async function getProductById(req, res) {
//     const productId = parseInt(req.params.pid);

//     if (!productId || isNaN(productId)) {
//         res.status(400).send({ error: 'ID inválido, debe ser un valor numérico' });
//         return;
//     }

//     try {
//         const product = await productsRepository.getProductById(productId);

//         if (product) {
//             res.json(product);
//         } else {
//             res.status(404).send({ error: 'Producto no encontrado' });
//         }
//     } catch (error) {
//         res.status(500).send({ error: 'Error al obtener producto' });
//     }
// }

// async function addProduct(req, res) {
//     const productData = req.body;
//     const thumbnailFile = req.file;
//     console.log('Cookie: ', req.cookies.userCookie)
//     try {
//         if (!productData.title || !productData.price || !productData.description || !productData.stock || !productData.code || !productData.category) {
//             throw CustomError.createError({
//                 name: 'AddProductError',
//                 cause: generateProductErrorInfo(productData),
//                 message: 'Error trying to create product',
//                 code: EErrors.INVALID_TYPER_ERROR
//             });
//         }

//         if (thumbnailFile) {
//             productData.thumbnail = thumbnailFile.filename;
//         } else {
//             productData.thumbnail = '';
//         };

//         // productData.owner = req.session.user.id;

//         const userCookie = req.cookies.userCookie;
//         console.log('userCookie en products controller: ', userCookie)
//         const decodedToken = jwt.verify(userCookie, configs.jwtKey);

//         console.log('decodedToken:', decodedToken);;

//         if (!decodedToken || !decodedToken.id) {
//             throw CustomError.createError({
//                 name: 'AuthenticationError',
//                 message: 'Invalid or missing user authentication token',
//                 code: EErrors.UNAUTHORIZED_ERROR
//             });
//         }

//         // Asigna el ID de usuario al campo 'owner' del producto
//         productData.owner = decodedToken.id;

//         const newProduct = await productsRepository.addProduct(productData);

//         res.status(201).send(newProduct);

//     } catch (error) {
//         console.error(error);

//         if (error.name === 'AddProductError') {
//             return next({
//                 name: 'AddProductError',
//                 cause: error.cause,
//                 code    : EErrors.INVALID_TYPER_ERROR,
//             });

//         } else {
//             return next({
//                 name: 'InternalError',
//                 cause: 'Error while creating product',
//                 code: EErrors.DATABASE_ERROR,
//             });
//         }
//     }
// };

// async function deleteProduct(req, res) {
//     const productId = req.params.pid;
//     const userId = req.session.user.id;
//     console.log('rol: ', req.session.user.role)

//     try {
//         const product = await productsRepository.getProductById(productId);

//         if (!product) {
//             return res.status(404).send({ message: 'Producto no encontrado' });
//         }
//         if (req.session.user.role === 'premium' && product.owner !== userId) {
//             return res.status(403).send({ message: 'No tienes permisos para borrar este producto' });
//         }

//         const result = await productsRepository.deleteProduct(productId);

//         if (!result) {
//             return res.status(404).send({ message: 'Producto no encontrado' });
//         } else {
//             return res.status(202).send({ message: 'Producto eliminado con éxito', data: result });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: 'error', message: 'Error al eliminar el producto' });
//     }
// }

// async function updateProduct(req, res) {
//     const productId = req.params.pid;

//     if (!productId) {
//         res.status(400).send({ error: 'Debe actualizar mediante un ID de producto' });
//         return;
//     }

//     const updatedFields = req.body;

//     try {
//         const updatedProduct = await productsRepository.updateProduct(productId, updatedFields);

//         if (!updatedProduct) {
//             res.status(404).send({ error: 'Producto no encontrado' });
//             return;
//         }

//         if (req.files && req.files.length > 0) {
//             const imageUrls = req.files.map((file) => {
//                 return file.filename;
//             });
//             updatedProduct.thumbnail = imageUrls;
//         }

//         res.status(200).send({ message: 'Producto actualizado con éxito', product: updatedProduct });
//     } catch (error) {
//         res.status(500).send({ error: 'Error al actualizar el producto' });
//     }
// }

// async function getMockProducts(req, res) {
//     try {
//         let mockProducts = []
//         for (let i = 0; i < 100; i++) {
//             mockProducts.push(generateMockProduct())
//         }
//         res.send({ status: 'success', payload: mockProducts })
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ status: 'error', message: 'Error al obtener mockingproducts' });
//     }
// };

// export {
//     getAll,
//     getProductById,
//     addProduct,
//     deleteProduct,
//     updateProduct,
//     getMockProducts
// };
