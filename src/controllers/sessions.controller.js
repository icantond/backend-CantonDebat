import { cartsRepository, usersRepository } from '../repositories/index.js';
import { createHash, isValidPassword } from '../utils.js';
import configs from '../config/config.js';
import transport from '../config/nodemailer.config.js';
import { generateToken } from '../utils.js';
import jwt from 'jsonwebtoken';

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
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
}

async function loginUser(req, res) {
    req.logger.debug(`Attempting to login with email: ${req.body.email}`);

    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
        const user = await usersRepository.getUserByEmail(email);

        if (!user || !isValidPassword(password, user.password)) {
            req.logger.warn(`Login failed for email: ${email}. Check credentials`);
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
        const token = jwt.sign(req.session.user, configs.jwtKey, {expiresIn: '1h'});
        res.cookie('userCookie', token, {maxAge: 3600000, httpOnly: true }).send({ status: 'success', message: 'Sesión iniciada con éxito' });

        req.logger.info(`Login successful for email: ${email}`);

        // res.send({ status: 'success', message: 'Sesión iniciada con éxito' });
    } catch (error) {
        req.logger.error(`Error during login: ${error.message}`);
        res.status(500).send({ status: 'error', message: error.message });
    }
}

function logoutUser(req, res) {
    req.session.destroy(error => {
        if (error) {
            req.logger.error(`Error during logout: ${error.message}`);
            return res.status(500).send({ status: 'error', error: 'Error al cerrar sesión' });

        }
        res.redirect('/');
        req.logger.info('Logout successful');
        console.log('Sesión cerrada');
    });
};

async function currentUser(req, res) {
    try {
        const user = req.session.user;
        if (!user) {
            return res.status(401).send({ status: 'error', message: 'No se ha iniciado sesión' });
        }
        res.send({ status: 'success', message: 'Usuario autenticado', user });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
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
            const newUser = await usersRepository.registerUser({
                first_name: req.user.first_name,
                last_name: '',
                email,
                age: 0,
                password: '',  
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

const sendPasswordResetLink = async (req, res) => {
    const userEmail = req.body.email;
    console.log('Intentando reestablecer contraseña user ', userEmail)
    const user = await usersRepository.getUserByEmail(userEmail);
    console.log('User: ', user, 'encontrado en BD')
    if (!user) {
        return res.status(400).json({ error: 'El correo proporcionado no está registrado.' });
    }    

    const token = generateToken(user.email);
    console.log('Token: ', token)

    const mailOptions = {
        from: configs.nodemailerUser,
        to: user.email,
        subject: 'Recuperación de contraseña',
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="http://localhost:8080/reset-password/${token}">Restablecer Contraseña</a>`,
    };
    
    try {
        transport.sendMail(mailOptions);
        res.status(200).json({ message: 'Se ha enviado un enlace de restablecimiento de contraseña al correo proporcionado.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al enviar el correo de recuperación de contraseña.' });
    }
};


const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decodedToken = jwt.verify(token, configs.jwtKey);

        const user = await usersRepository.getUserByEmail(decodedToken.email);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.password = createHash(password);
        await user.save();
        console.log('Contraseña restablecida exitosamente. User:', user.email);

        return res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

async function changeUserRole(req, res) {
    const userId = req.params.uid;
    const newRole = req.body.role;

    try {
        // Verificar si el usuario tiene permisos para cambiar el rol
        if (req.session.user.role !== 'admin' || !['user', 'premium'].includes(newRole)) {
            return res.status(403).send({ message: 'No tienes permisos para cambiar el rol de un usuario o el rol es inválido' });
        }
        
        // Cambiar el rol del usuario
        const updatedUser = await usersRepository.changeUserRole(userId, newRole);

        if (!updatedUser) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        } else {
            return res.status(200).json({ message: 'Rol de usuario actualizado con éxito', data: updatedUser });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error al cambiar el rol de usuario' });
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    handleGithubAuth,
    handleGithubCallback,
    sendPasswordResetLink, 
    resetPassword,
    changeUserRole, 
    currentUser
};