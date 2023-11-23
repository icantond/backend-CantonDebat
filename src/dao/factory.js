import configs from '../config/config.js';

let Carts;
let Products;
let Users;
let Tickets

const persistence = configs.persistence;

switch (persistence) {
    case 'MONGO':
        console.log('Working with MongoDB')
        const mongoose = await import('mongoose');
        await mongoose.connect(configs.mongoUrl);
        const { default: CartsMongo } = await import('./mongo/carts.mongo.js');
        const { default: ProductsMongo } = await import('./mongo/products.mongo.js');
        const { default: UsersMongo } = await import('./mongo/users.mongo.js');
        const { default: TicketsMongo } = await import('./mongo/tickets.mongo.js');
        Carts = CartsMongo;
        Products = ProductsMongo;
        Users = UsersMongo;
        Tickets = TicketsMongo;
        break;

    case 'MEMORY':
        console.log('Working with FS Memory')
        const { default: CartsMemory } = await import('./memory/carts.memory.js');
        const { default: ProductsMemory } = await import('./memory/products.memory.js');
        const { default: UsersMemory } = await import('./memory/users.memory.js');
        const { default: TicketsMemory } = await import('./memory/tickets.memory.js');
        Carts = CartsMemory;
        Products = ProductsMemory;
        Users = UsersMemory;
        Tickets = TicketsMemory;
        break;
}

export {
    Carts,
    Products,
    Users,
    Tickets
}