import configs from '../config/config.js';

let Carts;
let Products;
let Users;

const persistence = configs.persistence;

switch (persistence) {
    case 'MONGO':
        console.log('Working with MongoDB')
        const mongoose = await import('mongoose');
        await mongoose.connect(configs.mongoUrl);
        const { default: CartsMongo } = await import('./mongo/carts.mongo.js');
        const { default: ProductsMongo } = await import('./mongo/products.mongo.js');
        const { default: UsersMongo } = await import('./mongo/users.mongo.js');
        Carts = CartsMongo;
        Products = ProductsMongo;
        Users = UsersMongo;

        break;

    case 'MEMORY':
        console.log('Working with FS Memory')
        const { default: CartsMemory } = await import('./memory/carts.memory.js');
        const { default: ProductsMemory } = await import('./memory/products.memory.js');
        const { default: UsersMemory } = await import('./memory/users.memory.js');
        Carts = CartsMemory;
        Products = ProductsMemory;
        Users = UsersMemory;
        break;
}

export {
    Carts,
    Products,
    Users
}