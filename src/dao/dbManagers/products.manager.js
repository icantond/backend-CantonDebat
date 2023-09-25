// import { productsModel } from '../models/products.model.js';
// import ProductManager from '../../productManager.js';
import productsModel from '../models/products.model.js';

export default class Products {
    constructor() {
        console.log('Working on products with DB');
    }

    async addProduct(productData) {
        try {
            const product = new productsModel(productData);
            await product.save();
            return product;
        } catch (error) {
            throw new Error('Error al agregar el producto a la base de datos');
        }
    }

    getAll = async () => {
        const products = await productsModel.find().lean();
        return products;
    }
    getProductById = async(id) => {
        const result = await productsModel.findById(id); 
        return result;
    }
    save = async (product) => {
        const result = await productsModel.create(product);
        return result;
    }

    update = async (id, product) => {
        const result = await productsModel.updateOne({ _id: id }, product);
        return result;
    }
    
    delete = async (id, product) => {
        const result = await productsModel.deleteOne({ _id: id }, product);
        return result;
    }
};


// import fs from 'fs/promises'; // fs.promises para utilizar promesas en lugar de callbacks.
// import { fileURLToPath } from 'url';
// import path from 'path';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// class ProductManager {
//     constructor(filePath) {
//         this.products = [];
//         this.filePath = path.join(__dirname, 'db', filePath);
//         this.loadProducts();
//     }

//     async loadProducts() {
//         try {
//             const data = await fs.readFile(this.filePath, 'utf8');
//             if (data) {
//                 this.products = JSON.parse(data);

//             } else {
//                 this.products = [];
//                 console.log('No se encontraron productos en el archivo.');//para depuracion

//             }
//         } catch (error) {
//             this.products = [];
//             console.error('Error al cargar productos:', error); //para depuracion
//         }
//     }

//     async saveProducts() {
//         const data = JSON.stringify(this.products);
//         await fs.writeFile(this.filePath, data);
//     }

//     async addProduct(productData) {
//         console.log(productData)
//         const { title, description, code, price, stock, category, thumbnail } = productData;

//         if (!title || !description || !price || !thumbnail || !code || !stock) {
//             console.log('Todos los campos son obligatorios');
//             return;
//         }

//         const existingProduct = this.products.find((product) => product.code === code);
//         if (existingProduct) {
//             throw new Error('Ya existe un producto con el mismo código');
//         }
//         const newProductId = this.calculateNextProductId();

//         const newProduct = {
//             id: newProductId,
//             title,
//             description,
//             price,
//             stock,
//             thumbnail,
//             code,
//             status: true
//         };
//         this.products.push(newProduct);

//         await this.saveProducts();
//         return newProduct; //Async para esperar que termine la lectura
//     }

//     calculateNextProductId() {
//         const lastProduct = this.products[this.products.length - 1];
//         return lastProduct ? lastProduct.id + 1 : 1;
//     }
//     async getProducts() {
//         return this.products;
//     }

//     async getProductById(id) {
//         const product = this.products.find((product) => product.id === id);
//         return product;
//     }

//     async updateProduct(id, updatedFields) {
//         const productIndex = this.products.findIndex((product) => product.id === id);
//         if (productIndex === -1) {
//             throw new Error('Producto no encontrado');
//         }
//         Object.assign(this.products[productIndex], updatedFields);
//         await this.saveProducts();
//     }

//     async deleteProduct(id) {
//         console.log('Intentando eliminar producto con ID:', id);
//         console.log('Productos antes de la eliminación:', this.products);

//         const productIndex = this.products.findIndex((product) => product.id === id);
//         if (productIndex === -1) {
//             throw new Error('Producto no encontrado');
//         }
//         this.products.splice(productIndex, 1);
//         await this.saveProducts();

//         console.log('Productos después de la eliminación:', this.products);

//     }
// }

// export default ProductManager;