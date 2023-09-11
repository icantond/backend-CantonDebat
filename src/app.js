    import express from 'express';
    import handlebars from 'express-handlebars';
    import { Server } from 'socket.io';
    import { dirname } from 'path';
    import { fileURLToPath } from 'url';
    import productsRouter from './routes/products.router.js';
    import cartsRouter from './routes/carts.router.js';
    import viewsRouter from './routes/views.router.js';
    import path from 'path';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const app = express();
    const PORT = 8080;
    const httpServer =app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`) );

    
const publicDir = path.join(__dirname, '\\public');
app.use(express.static(publicDir))

    // app.use(express.static(__dirname + '/public'));
    const dirnnamePrint = publicDir;
    console.log(dirnnamePrint);
    const socketServer = new Server(httpServer);

    app.engine('handlebars', handlebars.engine());
    app.set('views',`${__dirname}` + '/views');//__dirname=src => me lleva a /src/views ok
    app.set('view engine', 'handlebars');
    app.use(express.static(__dirname + '\\public'));
    app.use('/', viewsRouter);
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);

    socketServer.on('connection', socket =>{
        console.log("Nuevo cliente conectado");
        socket.on('message', data =>{ 
            console.log(data);
        })
    })
