import { cartsRepository, usersRepository } from '../repositories/index.js';
import jwt from 'jsonwebtoken';
import { createHash, generateToken, isValidPassword } from '../utils.js';
import configs from '../config/config.js';
import transport from '../config/nodemailer.config.js';

async function registerUser(userData) {
    const { first_name, last_name, email, age, password, role } = userData;
    const exists = await usersRepository.getUserByEmail(email);

    if (exists) {
        return { status: 'error', message: 'User already exists' };
    }

    const validRoles = ['user', 'admin', 'premium'];
    const userRole = validRoles.includes(role) ? role : 'user';

    const newUser = await usersRepository.registerUser({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role: userRole,
    });

    const newCart = await cartsRepository.createCart({
        user: newUser._id,
        products: []
    });
    newUser.cart = newCart._id;
    await usersRepository.save(newUser);

    return { status: 'success', message: 'User registered' };
};

async function loginUser(email, password) {
    if (!email || !password) {
        throw new Error('Incomplete values');
    }

    const user = await usersRepository.getUserByEmail(email);

    if (!user || !isValidPassword(password, user.password)) {
        throw new Error('Nombre de usuario o contraseña incorrectos');
    }

    return {
        user: {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart._id,
            id: user._id
        },
        token: jwt.sign({
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart._id,
            id: user._id
        }, configs.jwtKey, { expiresIn: '1h' })
    };
};

async function handleGithubCallback(githubUser) {
    const { email } = githubUser;
    let user = await usersRepository.getUserByEmail(email);

    if (!user) {
        const newUser = await usersRepository.registerUser({
            first_name: githubUser.first_name,
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
        user = newUser;
    } else if (!user.cart) {
        const newCart = await cartsRepository.createCart({
            user: user._id,
            products: []
        });

        user.cart = newCart._id;
        await usersRepository.save(user);
        console.log(`Se ha asociado un carrito al usuario con el correo ${user.email}, con ID de carrito ${newCart}`);
    }

    return user;
};

async function sendPasswordResetLink(userEmail) {
    const user = await usersRepository.getUserByEmail(userEmail);

    if (!user) {
        throw new Error('El correo proporcionado no está registrado.');
    }

    const token = generateToken(user.email);

    const mailOptions = {
        from: configs.nodemailerUser,
        to: user.email,
        subject: 'Recuperación de contraseña',
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${configs.devHost}/reset-password/${token}">Restablecer Contraseña</a>`,
    };

    try {
        transport.sendMail(mailOptions);
        return user.email;
    } catch (error) {
        console.error(error);
        throw new Error('Error al enviar el correo de recuperación de contraseña.');
    }
};

async function resetPassword(token, newPassword) {
    const decodedToken = jwt.verify(token, configs.jwtKey);

    const user = await usersRepository.getUserByEmail(decodedToken.email);

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    user.password = createHash(newPassword);
    await user.save();

    return user.email;
};

export {
    registerUser,
    loginUser,
    handleGithubCallback,
    sendPasswordResetLink,
    resetPassword
};