import * as chai from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import configs from '../../../src/config/config.js';

const expect = chai.expect;
const requester = supertest(configs.devHost);

describe('Testing del módulo Products', () => {
    before(async function () {
        this.timeout(10000);
        try {
            await mongoose.connect(configs.mongoUrl);
            await mongoose.connection.db.dropCollection('products');
            await mongoose.connection.db.dropCollection('users');
        } catch (error) {
            console.error('Error al conectar a la base de datos', error);
        }
    });
    it('Debería agregar correctamente un producto a la base de datos', async function () {
        this.timeout(10000);

        

        const mockUser = {
            first_name: 'Prueba',
            last_name: 'Prueba',
            email: 'prueba@mail.com',
            password: '1234',
            age: 25,
            role: 'admin',
        }

        //Registrar mockUser:
        await requester.post('/api/sessions/register').send(mockUser).expect(201);
        

        //loguear mockUser:
        const loginResponse = await requester.post('/api/sessions/login').send({
            email: mockUser.email,
            password: mockUser.password
        })
        .expect(200)
    
        //obtener id del mockUser:
        const token = loginResponse.body.token;
        const decodedToken = jwt.verify(token, configs.jwtKey);
        const _id = decodedToken.id;


        const mockProduct = {
            title: 'Producto de prueba',
            description: 'Descripción del producto de prueba',
            price: 100,
            stock: 10,
            category: 'Categoría de prueba',
            thumnail: 'test.jpg',
            code: 'ABC123',
        }
        const addProductResponse = await requester.post('/api/products')
        .send(mockProduct)
        .set('Cookie', `userCookie=${token}`)
        .expect(201)
            .expect((response) => {
                expect(response.body.title).to.be.equal(mockProduct.title);
                expect(response.body.owner).to.be.equal(_id);
            });
    });
    })

    
