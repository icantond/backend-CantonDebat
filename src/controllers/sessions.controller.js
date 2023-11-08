            import UsersManager from '../dao/dbManagers/users.manager.js';
import { createHash, isValidPassword } from '../utils.js';

const usersManager = new UsersManager();

async function registerUser(req, res) {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await usersManager.getUserByEmail(email);

        if (exists) {
            return res.status(400).send({ status: 'error', message: 'User already exists' });
        }

        await usersManager.createUser({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        });

        res.status(201).send({ status: 'success', message: 'User registered' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await usersManager.getUserByEmail(email);

        if (!user || !isValidPassword(password, user.password)) {
            return res.status(401).send({ status: 'error', message: 'Nombre de usuario o contraseña incorrectos' });
        }

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
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
