import { decodeJwtFromCookie } from '../../utils.js';

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
}

const adminAccess = (req, res, next) => {
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'premium')) {
        return res.redirect('/');
    }
    next();
}

// const authMiddleware = (req, res, next) => {
//     console.log('req.session.user: ', req.session.user); // Agrega esta línea para imprimir el usuario en la consola
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     return res.redirect('/login');
// };


const authMiddleware = (req, res, next) => {
    const token = req.cookies.userCookie;
    console.log(`token: ${token}`)

    if (!token) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }

    const decodedToken = decodeJwtFromCookie(token);

    if (!decodedToken) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = decodedToken;
    next();
};

export {
    publicAccess,
    privateAccess,
    adminAccess, 
    authMiddleware
};