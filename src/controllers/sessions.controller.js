import { cartsRepository, usersRepository } from '../repositories/index.js';
import { createHash, isValidPassword } from '../utils.js';

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
            cart: user.cart._id,
            id: user._id
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

async function handleGithubAuth(req, res) {
    res.send({ status: 'success', message: 'user registered' });
}
async function handleGithubCallback(req, res) {
    try {
        req.session.user = req.user;

        const { email } = req.user;
        const user = await usersRepository.getUserByEmail(email);

        if (!user) {
            // Este bloque se ejecutará si el usuario registrado desde GitHub no existe localmente
            const newUser = await usersRepository.registerUser({
                first_name: req.user.first_name,
                last_name: '',
                email,
                age: 0,
                password: '',  // Puedes dejarlo en blanco ya que no se utilizará
            });

            const newCart = await cartsRepository.createCart({
                user: newUser._id,
                products: []
            });

            newUser.cart = newCart._id;
            await usersRepository.save(newUser);
            console.log(`Se ha creado el usuario con el correo ${newUser.email}, con ID de carrito ${newCart}`);
        } else if (!user.cart) {
            const newCart = await cartsRepository.createCart({
                user: user._id,
                products: []
            });

            user.cart = newCart._id;
            await usersRepository.save(user);
            console.log(`Se ha asociado un carrito al usuario con el correo ${user.email}, con ID de carrito ${newCart}`);
        }

        res.redirect('/');
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
}
// async function handleGithubCallback(req, res) {
//     try {
//         req.session.user = req.user;
//         res.redirect('/');
//     } catch (error) {
//         res.status(500).send({ status: 'error', message: error.message });
//     }
// }


export {
    registerUser,
    loginUser,
    logoutUser,
    handleGithubAuth,
    handleGithubCallback
};