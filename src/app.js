import express from 'express';
import ProductManager from './productManager.js';

const app = express();
const PORT = 3030;

const productCatalog = new ProductManager('products.json');

app.get('/products', async (req, res) => {
  const limit = req.query.limit;

  try {
    const products = await productCatalog.getProducts();

    if (limit) {
      res.json(products.slice(0, parseInt(limit))); // Establecer el límite de productos a mostrar
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.get('/products/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  
  if(!productId || isNaN(productId)){
    res.status(400).json({ error: 'ID inválido, debe ser un valor numérico' });
    return;
  }

  try {
    const product = await productCatalog.getProductById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
