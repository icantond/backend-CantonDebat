import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js'

const router = express.Router();
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
