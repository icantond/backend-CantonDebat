class ProductManager {
    constructor() {
        this.products = [];
        this.productId = 1;
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
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find((product) => product.id === id);

        if (!product) {
            console.log('Producto no encontrado');
            return;
        }
        return product;
    }
}

// Pruebas
const productCatalog = new ProductManager();

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

// Testing omitir un campo (precio)
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