
import Router from '../routes/router.js';
import Users from '../dao/dbManagers/users.manager.js';
import { accessRoles, passportStrategiesEnum } from '../config/enums.js';
import { createHash, generateToken, isValidPassword } from '../utils.js';


export default class SessionsRouter extends Router {
    constructor() {
        super();
        this.usersManager = new Users();
    }

    init() {
        this.post('/login', [accessRoles.PUBLIC], passportStrategiesEnum.NOTHING, this.login);
        this.post('/register', [accessRoles.PUBLIC], passportStrategiesEnum.NOTHING, this.register);
        this.post('/logout', [accessRoles.PUBLIC], passportStrategiesEnum.NOTHING, this.logout);
        this.get('/github-callback', [accessRoles.PUBLIC], passportStrategiesEnum.GITHUB, this.githubCallback);
        this.put('/:uid/update-cart', [accessRoles.PUBLIC], passportStrategiesEnum.NOTHING, this.updateUserCart);
    }

    login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await usersManager.getByEmail(email);
            if (!user) {
                return res.sendClientError('Incorrect Credentials');
            }
            const comparePassword = isValidPassword(password, user.password)

            if (!comparePassword) {
                return res.sendClientError('Incorrect Credentials');
            }
            delete user.password;
            const accessToken = generateToken(user);
            res.sendSuccess({ accessToken });

        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    register = async (req, res) => {
        const { first_name, last_name, email, age, password } = req.body;
        try {
            if (!first_name || !last_name || !email || !age || !password) {
                return res.sendClientError('Incomplete values');
            }

            const exists = await this.usersManager.getByEmail(email)
            if (exists) {
                return res.sendClientError('User already exists')
            }

            const hashedPassword = createHash(password);
            const newUser = { ...req.body }
            newUser.password = hashedPassword;
            const user = await this.usersManager.createUser(newUser);

            const cart = await cartsModel.create({ user: user._id });

            // Asocia el carrito al usuario
            user.cart = cart._id;
            await user.save();
            res.sendSuccess(user);

        } catch (error) {
            res.sendServerError(error.message);
        }
    }

    logout = async (req, res) => {
        req.session.destroy(error => {
            if (error) return res.sendServerError(error.message)
            res.redirect('/');
            console.log('Sesión cerrada');
        })
    }

    githubCallback = async (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }

    updateUserCart = async (req, res) => {
        const userId = req.params.uid;
        const cartId = req.body.cartId;

        try {
            const user = await usersModel.findById(userId);

            if (!user) {
                return res.sendClientError('User not found');
            }

            user.cart = cartId;
            await user.save();

            res.sendSuccess({ message: 'Cart updated successfully' });
        } catch (error) {
            res.sendServerError(error.message);
        }
    }
}

// import { Router } from 'express';
// import Router from '../routes/router.js'
// import usersModel from '../dao/models/users.model.js'
// import { createHash, isValidPassword } from '../utils.js';
// import passport from 'passport';
// import cartsModel from '../dao/models/carts.model.js'
// import { hash } from 'bcrypt';

// const router = Router();
// //Primer servicio para registrar el usuario
// router.post('/register', async (req, res) => {
//     try {
//         const { first_name, last_name, email, age, password } = req.body;
//         const exists = await usersModel.findOne({ email });

//         if (exists) {
//             return res.status(400).send({ status: 'error', message: 'User aflready exists' });
//         }

//         // await usersModel.create({
//         //     first_name,
//         //     last_name,
//         //     email,
//         //     age,
//         //     password: createHash(password)
//         // });
//         const newUser = {
//             first_name,
//             last_name,
//             email,
//             age,
//             password: createHash(password)
//         }

//         // Crea un nuevo usuario
//         const user = await usersModel.create(newUser);

//         // Crea un nuevo carrito vacío
//         const cart = await cartsModel.create({ user: user._id });

//         // Asocia el carrito al usuario
//         user.cart = cart._id;
//         await user.save();

//         res.status(201).send({ status: 'success', message: 'User registered' });
//     } catch (error) {
//         res.status(500).send({ status: 'error', message: error.message })
//     }
// });

// // router.post('/login', async (req, res) => {
// //     try {
// //         const { email, password } = req.body;
// //         console.log(email, password)
// //         // console.log('Intentando iniciar sesión con el email: ', email, 'password', password)
// //         const user = await usersModel.findOne({ email });

// //         if (!user) {
// //             console.log('Verifique los datos ingresados')
// //             return res.status(401).send({ status: 'error', message: 'Nombre de usuario o contraseña incorrectos' });
// //         }

// //         if (!isValidPassword(password, user.password)) {
// //             console.log('Verifique los datos ingresados')
// //             return res.status(401).send({ status: 'error', message: 'Nombre de usuario o contraseña incorrectos' });
// //         }

// //         console.log('Iniciando sesión con el email: ', email, 'password', password)
// //         req.session.user = {
// //             id: user._id,
// //             name: `${user.first_name} ${user.last_name}`,
// //             email: user.email,
// //             age: user.age,
// //             role: user.role,
// //             cart: user.cart._id
// //         }

// //         res.send({ status: 'success', message: 'Sesión iniciada con éxito' });
// //     } catch (error) {
// //         res.status(500).send({ status: 'error', message: error.message })
// //     }
// // });

// router.get('/logout', (req, res) => {
//     req.session.destroy(error => {
//         if (error) return res.status(500).send({ status: 'error', error: 'Error al cerrar sesión' });
//         res.redirect('/');
//         console.log('Sesión cerrada');
//     })
// });

// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
//     res.send({ status: 'success', message: 'user registered' });
// });

// router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
//     req.session.user = req.user;
//     res.redirect('/');
// });

// router.put('/:uid/update-cart', async (req, res) => {
//     const userId = req.params.uid;
//     const cartId = req.body.cartId;

//     try {
//         const user = await usersModel.findById(userId);

//         if (!user) {
//             return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
//         }

//         user.cart = cartId;
//         await user.save();

//         res.status(200).json({ status: 'success', message: 'Campo "cart" actualizado correctamente' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Error al actualizar el campo "cart" en el modelo de usuario' });
//     }
// });


// export default router;