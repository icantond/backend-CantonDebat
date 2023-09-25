import express from 'express';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import path from 'path';
// import productManager from './dao/dbManagers/products.manager.js'

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
// import ProductManager from './productManager.js';
import Products from './dao/dbManagers/products.manager.js';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
const socketServer = new Server(httpServer);
// const productManager = new productManager();

//Settings de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

//Route de static folder
const staticFolderPath = path.join(__dirname, '..', 'public');
console.log('Ruta de la carpeta estática:', staticFolderPath);
app.use('/static', express.static(staticFolderPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rutas
app.use('/', viewsRouter);
app.use('/realtimeproducts', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });

const io = socketServer;
socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    const productManager = new Products('products');

    socket.on('addProduct', async (newProduct) => {
        try {
            const addedProduct = await productManager.addProduct(newProduct);
            const updateProducts = await productManager.getProducts();

            io.emit('updateProducts', updateProducts);
            console.log('Producto agregado: ', addedProduct);

        }

        catch (error) {
            console.error('Error al agregar el producto:', error);
        };
    });

    socket.on('eliminar_producto', async (data) => {
        const productId = data.productId;

        try {
            // Eliminar el producto utilizando ProductManager.deleteProduct
            await productManager.deleteProduct(productId);

            // Emitir un evento para actualizar la vista en tiempo real
            io.emit('producto_eliminado', { productId });
        } catch (error) {
            // Manejar errores, si es necesario
            console.error('Error al eliminar el producto:', error);
        }
    });
});
