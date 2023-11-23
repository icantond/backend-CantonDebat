import { Carts, Users, Products, Tickets } from "../dao/factory.js";
import CartsRepository from "./carts.repository.js";
import UsersRepository from "./users.repository.js";
import ProductsRepository from "./products.repository.js";
import TicketsRepository from "./tickets.repository.js";

const cartsRepository = new CartsRepository(Carts);
const usersRepository = new UsersRepository(Users);
const productsRepository = new ProductsRepository(Products);
const ticketsRepository = new TicketsRepository(Tickets);

export {
    cartsRepository, 
    usersRepository,
    productsRepository,
    ticketsRepository
}