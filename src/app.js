import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import { __dirname, __mainDirname } from './utils.js';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import path from 'path';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import initializePassport from './config/passport.config.js';
import passport from 'passport';
import configs from './config/config.js';
import errorHandler from './middlewares/errors/index.js'
import { addLogger } from './utils/logger.js';
import swaggerUiExpress from 'swagger-ui-express';
import swaggerFile from '../docs/swagger-output.json' assert { type: 'json' }
import socketsConfig from './utils/sockets.js';

const app = express();
try {
    await mongoose.connect(configs.mongoUrl);
    console.log('Conexión a MongoDB exitosa');
} catch (error) {
    console.error('Error al conectar a MongoDB:', error);
}

const PORT = configs.port;
const httpServer = app.listen(PORT, () => console.log(`Server successfuly running on PORT ${PORT}`));
const socketServer = new Server(httpServer);


app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerFile));

app.use(cookieParser());

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
    cookie: {secure: false, maxAge: 3.6e+6}
}));

//passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
// app.use(authMiddleware)
app.use(addLogger);

//RUTAS VISTAS
app.use('/', viewsRouter);
app.use('/realtimeproducts', viewsRouter);
app.use('/chat', viewsRouter);
app.use('/products', viewsRouter);
app.use('/productdetail', viewsRouter);
app.use('/forgot', viewsRouter);
app.use('/profile', viewsRouter);
app.use('/loggerTest', viewsRouter);
app.use('/roles', viewsRouter);
//RUTAS PRODUCTS
app.use('/api/products', productsRouter);
//RUTAS CARTS
app.use('/carts', cartsRouter); 
app.use('/api/carts', cartsRouter);
//RUTAS USERS
app.use('/api/users', usersRouter)
//RUTAS SESSIONS
app.use('/api/sessions', sessionsRouter);
app.use('/reset-password', sessionsRouter);
app.use('/forgot-password', sessionsRouter);
    
app.use('/api/mockingproducts', productsRouter)


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
const io = new Server(httpServer);
socketsConfig(io);
