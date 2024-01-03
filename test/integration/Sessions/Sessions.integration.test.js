import mongoose from 'mongoose';
import * as chai from 'chai';
import supertest from 'supertest';
import configs from '../../../src/config/config.js';

const expect = chai.expect;
const requester = supertest(configs.devHost);

describe('Testing del módulo Sessions', () => {
    //Limpiar la coleccion 'users' de la base de datos con un drop antes de cada prueba
    before(async function () {
        this.timeout(10000);
        try {
            await mongoose.connect(configs.mongoUrl);
            await mongoose.connection.db.dropCollection('users');
        } catch (error) {
            console.error('Error al conectar a la base de datos', error);
        }
    });

    it('Debería manejar correctamente el registro de un usuario existente', async function () {
        this.timeout(10000);

        const mockUser = {
            first_name: 'Juan',
            last_name: 'Perez',
            email: 'testperez@mail.com',
            password: '123456',
            age: '20',
            role: 'admin'
        };

        // Registrar al usuario por primera vez
        const registerResponse = await requester.post('/api/sessions/register')
            .send(mockUser)
            .expect(201);

        // Intentar registrar al mismo usuario nuevamente
        const secondRegisterResponse = await requester.post('/api/sessions/register')
            .send(mockUser)
            .expect(400);

        expect(secondRegisterResponse.body).to.have.property('status', 'error');
        expect(secondRegisterResponse.body).to.have.property('message', 'User already exists');

        expect(registerResponse.body.status).to.be.equal('success');
    });
});






//Borrar los datos de la base de datos antes de cada prueba
// it('Debería agregar una unidad del producto con id seleccionado al carrito del usuario', async function () {
//     this.timeout(10000);
//     //REGISTRAR USUARIO DE PRUEBAS
//     const mockUser = {
//         first_name: 'Juan',
//         last_name: 'Perez',
//         email: 'testperez@mail.com',
//         password: '123456',
//         age: '20',
//         role: 'admin'
//     };

//     const registerResponse = await requester.post('/api/sessions/register')
//         .send(mockUser)
//         .expect(201);


//     //Iniciar sesion para agregar producto al catalogo
//     const loginResponse = await requester
//         .post('/api/sessions/login')
//         .set('Cookie', userCookie)
//         .send({
//             email: mockUser.email,
//             password: mockUser.password
//         })
//         .expect(200)

//     const cookieResult = loginResponse.headers['set-cookie'][0];
//     const cookieResultSplit = cookieResult.split('=');
//     let cookie = {
//         name: cookieResultSplit[0],
//         value: cookieResultSplit[1]
//     };
//     console.log('cookie: ', cookie);

//     const valueResultSplit = cookie.value.split(";");
//     const token = valueResultSplit[0];
//     console.log('token: ', token);
//     const decodedToken = jwt.verify(token, 'coder123');
//     const cartId = decodedToken.cart;
//     console.log('cartId: ', cartId);

//     //AGREGAR PRODUCTO AL CATALOGO
//     const mockProduct = {
//         title: 'Producto de prueba',
//         description: 'Este es un producto de prueba',
//         code: 'PRUEBA',
//         price: '100',
//         stock: '10',
//         category: 'prueba',
//     };
//     const addproductResponse = await requester.post('/api/products')
//         .send(mockProduct)
//         .expect(201);
//     const productId = addproductResponse.body._id;
//     const addToCartResponse = await requester.post(`/api/carts/${cartId}/product/${productId}`).expect(200);

//     expect(addToCartResponse).to.have.property('status', 'success');
//     expect(addToCartResponse).to.have.property('payload');
//     expect(addToCartResponse.payload).to.have.property('products');
//     expect(addToCartResponse.payload.products).to.have.lengthOf(1);
//     expect(addToCartResponse.payload.products[0]).to.have.property('product');
//     expect(addToCartResponse.payload.products[0]).to.have.property('quantity', 1);
//     expect(addToCartResponse.payload.products[0].product).to.have.property('_id', productId);
//     expect(addToCartResponse.payload.products[0].product).to.have.property('title', mockProduct.title);
// });
