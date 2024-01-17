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
    console.log(`req.session.user: ${req.session.user.email}`)
    const token = req.cookies.userCookie;
    console.log(`token: ${token}`)


    // Verificar si el token está presente
    if (!token) {
        return res.status(401).json({ message: 'No estás autenticado' });
    }

    // Decodificar el token
    const decodedToken = decodeJwtFromCookie(token);

    // Verificar si el token es válido
    if (!decodedToken) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    // Almacenar los datos del usuario en el objeto de solicitud
    req.user = decodedToken;
    next();
};

export {
    publicAccess,
    privateAccess,
    adminAccess, 
    authMiddleware
};