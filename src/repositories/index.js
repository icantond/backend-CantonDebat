import { Carts, Users, Products } from "../dao/factory.js";
import CartsRepository from "./carts.repository.js";
import UsersRepository from "./users.repository.js";
import ProductsRepository from "./products.repository.js";

const cartsRepository = new CartsRepository(Carts);
const usersRepository = new UsersRepository(Users);
const productsRepository = new ProductsRepository(Products);

export {
    cartsRepository, 
    usersRepository,
    productsRepository
}