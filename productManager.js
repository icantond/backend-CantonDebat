const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.productId = 1;
        this.filePath = filePath;
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    saveProducts() {
        const data = JSON.stringify(this.products);
        fs.writeFileSync(this.filePath, data);
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        const existingProduct = this.products.find(
            (product) => product.code === code
        );
        if (existingProduct) {
            console.log('Ya existe un producto con el mismo código');
            return;
        }

        const newProduct = {
            id: this.productId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        this.productId++;

        this.saveProducts();
    }

    getProducts() {
        this.loadProducts();
        return this.products;
    }

    getProductById(id) {
        this.loadProducts();
        const product = this.products.find((product) => product.id === id);

        if (!product) {
            console.log('Producto no encontrado');
            return;
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        this.loadProducts();
        const productIndex = this.products.findIndex((product) => product.id === id);

        if (productIndex === -1) {
            console.log('Producto no encontrado');
            return;
        }

        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedFields,
        };

        this.saveProducts();
    }

    deleteProduct(id) {
        this.loadProducts();
        const productIndex = this.products.findIndex((product) => product.id === id);

        if (productIndex === -1) {
            console.log('Producto no encontrado');
            return;
        }

        this.products.splice(productIndex, 1);
        this.saveProducts();
    }
}

// Pruebas
const productCatalog = new ProductManager('products.json');

console.log(productCatalog.getProducts());

productCatalog.addProduct(
    'producto prueba',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc123',
    25
);
console.log(productCatalog.getProducts());

// Testing agregar prod con mismo código:
productCatalog.addProduct(
    'producto prueba',
    'Este es un producto prueba',
    200,
    'Sin imagen',
    'abc123',
    25
);

// Testing agregar un producto nuevo
productCatalog.addProduct(
    'lentes de sol',
    'gafas de sol super trendy',
    2500,
    'sunglasses.jpg',
    'SGL0001',
    4
);

// Testing omitir un valor (precio)
productCatalog.addProduct(
    'lentes con aumento',
    'armazón dorado',
    'sunglasses.jpg',
    'SGL0001',
    4
);

console.log(productCatalog.getProductById(1));
console.log(productCatalog.getProductById(2));
console.log(productCatalog.getProductById(3));

//Testing updateProduct
productCatalog.updateProduct(2, { price: 1200, stock: 15 });
console.log(productCatalog.getProductById(2))

//Testing deleteProduct
productCatalog.deleteProduct(3)
console.log(productCatalog.getProductById(3))