import express from 'express';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import path from 'path';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import chatRouter from './routes/chat.router.js';
import messagesModel from './dao/models/messages.model.js';
import Products from './dao/dbManagers/products.manager.js';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
const socketServer = new Server(httpServer);

//Settings de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')
//Settings de Static Folder y URLs:
app.use('/static', express.static(path.join(__dirname, '../public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rutas
app.use('/', viewsRouter);
app.use('/realtimeproducts', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/chat', chatRouter);

mongoose.connect('mongodb+srv://nachoman4:T5Cq5qd7DDKrfOYp@cluster47300icd.5tk8odk.mongodb.net/ecommerce?retryWrites=true&w=majority') //ATLAS
// mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true }) //LOCAL
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch((error) => {
        console.error('Error al conectar a MongoDB:', error);
    });


//CONFIGURACION DE SOCKETS
const io = socketServer;

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");
    const productManager = new Products('products');

    //Socket para agregar productos
    socket.on('addProduct', async (newProduct) => {
        try {
            const addedProduct = await productManager.save(newProduct);
            const updatedProducts = await productManager.getAll();
    
            io.emit('updateProducts', updatedProducts); // Envía la lista actualizada al cliente
            console.log('Producto agregado:', addedProduct);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });
    
    //Socket para eliminar productos
    socket.on('eliminar_producto', async (data) => {
        const productId = data.productId;

        try {

            await productManager.delete(productId);
            io.emit('producto_eliminado', { productId });

            const updatedProducts = await productManager.getAll();
            io.emit('updateProducts', updatedProducts);

        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    });

    //Socket para chat:
    socket.on('chatMessage', (data) => {
        const { user, message } = data;
        const newMessage = new messagesModel({ user, message });
        newMessage.save();

        io.emit('message', data);
    });
});
