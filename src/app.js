import express from 'express';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import path from 'path';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './productManager.js';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine','handlebars')

const staticFolderPath = path.join(__dirname, '..', 'public');
console.log('Ruta de la carpeta estática:', staticFolderPath);

app.use('/static', express.static(staticFolderPath));

app.use('/', viewsRouter);
app.use('/realtimeproducts', viewsRouter);

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const io = socketServer; 
socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");
    
    const productManager = new ProductManager('products.json');

    socket.on('addProduct', async (newProduct) => {
        try{
            const addedProduct = await productManager.addProduct(newProduct);
            const updateProducts = await productManager.getProducts();

            io.emit('updateProducts', updateProducts);
            console.log('Producto agregado: ', addedProduct);
            
        }

            catch (error) {
                console.error('Error al agregar el producto:', error);
            };
    });
});