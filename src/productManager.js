import fs from 'fs/promises'; // fs.promises para utilizar promesas en lugar de callbacks.

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.productId = 1;
        this.filePath = filePath;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            if (data) {
                this.products = JSON.parse(data);
            } else {
                this.products = [];
            }
        } catch (error) {
            this.products = [];
        }
    }

    async saveProducts() {
        const data = JSON.stringify(this.products);
        await fs.writeFile(this.filePath, data);
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
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
            stock,
            thumbnail,
            code
        };

        this.products.push(newProduct);
        this.productId++;

        await this.saveProducts(); //Async para esperar que termine la lectura
    }

    async getProducts() {
        return this.products;
    }

    ///resto de los metodos:

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

export default ProductManager;