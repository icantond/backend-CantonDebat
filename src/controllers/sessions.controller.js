import { Users } from '../dao/factory.js';
import UsersRepository from '../repositories/users.repository.js';
import CartsRepository from '../repositories/carts.repository.js';
// import { usersRepository } from '../repositories/index.js';
// import UsersManager from '../dao/dbManagers/users.manager.js';
import { createHash, isValidPassword } from '../utils.js';

// const usersManager = new UsersManager();
const usersRepository = new UsersRepository();
const cartsRepository = new CartsRepository();

async function registerUser(req, res) {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await usersRepository.getUserByEmail(email);

        if (exists) {
            return res.status(400).send({ status: 'error', message: 'User already exists' });
        }

        const newUser = await usersRepository.registerUser({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        });

        const newCart = await cartsRepository.createCart({
            user: newUser._id,
            products: []
        });
        newUser.cart = newCart._id;
        await usersRepository.save(newUser);
        console.log(`Se ha creado el usuario con el correo ${newUser.email}, con ID de carrito ${newCart}`);
        res.status(201).send({ status: 'success', message: 'User registered' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        console.log(`Intentando iniciar sesión con email ${email} desde sessions.controller.js`)
        const user = await usersRepository.getUserByEmail(email);

        if (!user || !isValidPassword(password, user.password)) {
            return res.status(401).send({ status: 'error', message: 'Nombre de usuario o contraseña incorrectos' });
        }

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart._id
        }

        res.send({ status: 'success', message: 'Sesión iniciada con éxito' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
}

function logoutUser(req, res) {
    req.session.destroy(error => {
        if (error) return res.status(500).send({ status: 'error', error: 'Error al cerrar sesión' });
        res.redirect('/');
        console.log('Sesión cerrada');
    });
}

export {
    registerUser,
    loginUser,
    logoutUser
};


// async function registerUser(req, res) {
//     try {
//         const { first_name, last_name, email, age, password } = req.body;
//         const exists = await usersManager.getUserByEmail(email);

//         if (exists) {
//             return res.status(400).send({ status: 'error', message: 'User already exists' });
//         }

//         await usersManager.createUser({
//             first_name,
//             last_name,
//             email,
//             age,
//             password: createHash(password)
//         });

//         res.status(201).send({ status: 'success', message: 'User registered' });
//     } catch (error) {
//         res.status(500).send({ status: 'error', message: error.message });
//     }
// }

// async function loginUser(req, res) {
//     try {
//         const { email, password } = req.body;
//         const user = await usersManager.getUserByEmail(email);

//         if (!user || !isValidPassword(password, user.password)) {
//             return res.status(401).send({ status: 'error', message: 'Nombre de usuario o contraseña incorrectos' });
//         }

//         req.session.user = {
//             name: `${user.first_name} ${user.last_name}`,
//             email: user.email,
//             age: user.age,
//             role: user.role
//         }

//         res.send({ status: 'success', message: 'Sesión iniciada con éxito' });
//     } catch (error) {
//         res.status(500).send({ status: 'error', message: error.message });
//     }
// }

// function logoutUser(req, res) {
//     req.session.destroy(error => {
//         if (error) return res.status(500).send({ status: 'error', error: 'Error al cerrar sesión' });
//         res.redirect('/');
//         console.log('Sesión cerrada');
//     });
// }

// export {
//     registerUser,
//     loginUser,
//     logoutUser
// };
