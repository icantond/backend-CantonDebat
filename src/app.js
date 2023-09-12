import express from 'express';
import { __dirname } from './utils.js';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import path from 'path';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
const socketServer = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine','handlebars')
// app.use(express.static(__dirname + 'public'))

const staticFolderPath = path.join(__dirname, '..', 'public');
console.log('Ruta de la carpeta estática:', staticFolderPath);

app.use('/static', express.static(staticFolderPath));

app.use('/', viewsRouter);

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");
    socket.on('message', data => {
        console.log(data);
    })
});