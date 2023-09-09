import fs from 'fs/promises'; // fs.promises para utilizar promesas en lugar de callbacks.

class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.filePath = `./db/${filePath}`; //llevo el filePath a la carpeta /src/filepath
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

    async addProduct(productData) {
        console.log(productData)
        const { title, description, code, price, stock, category, thumbnail } = productData;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log('Todos los campos son obligatorios');
            return;
        }

        const existingProduct = this.products.find((product) => product.code === code);
        if (existingProduct) {
            throw new Error('Ya existe un producto con el mismo código');
        }
        const newProductId = this.calculateNextProductId();

        const newProduct = {
            id: newProductId,
            title,
            description,
            price,
            stock,
            thumbnail,
            code,
            status: true
        };
        this.products.push(newProduct);
        
        await this.saveProducts();
        return newProduct; //Async para esperar que termine la lectura
    }

    calculateNextProductId() {
        const lastProduct = this.products[this.products.length - 1];
        return lastProduct ? lastProduct.id + 1 : 1;
    }
    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find((product) => product.id === id);
        return product;
    }

    async updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }
        Object.assign(this.products[productIndex], updatedFields);
        await this.saveProducts();
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }
        this.products.splice(productIndex, 1);
        await this.saveProducts();
    }
}

export default ProductManager;