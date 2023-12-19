import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import path from 'path';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import messagesModel from './dao/mongo/models/messages.model.js';
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import configs from './config/config.js';
import { productsRepository } from './repositories/index.js';
import errorHandler from './middlewares/errors/index.js'
import { addLogger } from './utils/logger.js';

const app = express();
console.log(configs)
try {
    await mongoose.connect(configs.mongoUrl);
    console.log('Conexión a MongoDB exitosa');
} catch (error) {
    console.error('Error al conectar a MongoDB:', error);
}

const PORT = configs.port;
const httpServer = app.listen(PORT, () => console.log(`Server successfuly running on PORT ${PORT}`));
const socketServer = new Server(httpServer);

//Settings de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')
//Settings de Static Folder y URLs:
app.use('/static', express.static(path.join(__dirname, '../public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
//Persistir nuestra session en BDD

app.use(session({
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        ttl: 3600 //en segundos
    }),
    secret: configs.sessionSecret,
    resave: true,
    saveUninitialized: true,
}));

//passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(addLogger);

//rutas OK
app.use('/', viewsRouter);
app.use('/realtimeproducts', viewsRouter);
app.use('/carts', cartsRouter); 
app.use('/chat', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/products', viewsRouter);
app.use('/productdetail', viewsRouter);
app.use('/forgot', viewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/profile', viewsRouter);
app.use('/loggerTest', viewsRouter);
app.use('/reset-password', sessionsRouter);
app.use('/forgot-password', sessionsRouter);
    
// app.use('/api/mockingproducts', productsRouter)


app.use((req, res, next) => {
    const publicRoutes = ['/login', '/register', '/forgot-password']; 
    const resetPasswordRoutes = ['/api/sessions/reset-password'];

    // Permitir acceso a rutas públicas
    if (publicRoutes.includes(req.path) || resetPasswordRoutes.some(route => req.path.startsWith(route))) {
        return next();
    }

    // Resto del middleware de autenticación
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
});



//CONFIGURACION DE SOCKETS
const io = socketServer;

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    //Socket para agregar productos
    socket.on('addProduct', async (newProduct) => {
        try {
            const updatedProducts = await productsRepository.getAll();
    
            socket.emit('updateProducts', updatedProducts);
            console.log('Producto agregado:', newProduct);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });
    
    //Socket para eliminar productos
    socket.on('eliminar_producto', async (data) => {
        const productId = data.productId;
        const userId = data.userId;
        const userRole = data.userRole;
        const productOwner = data.productOwner;
    
        try {
            if (!userId || !userRole || !productOwner) {
                console.error('Datos incompletos recibidos para eliminar el producto');
                return;
            }
    
            if (userRole === 'premium' && productOwner !== userId) {
                console.error('Usuarios premium solo pueden eliminar sus propios productos');
                return;
            }
    
            await productsRepository.delete(productId);
            io.emit('producto_eliminado', { productId });
    
            const updatedProducts = await productsRepository.getAll();
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
