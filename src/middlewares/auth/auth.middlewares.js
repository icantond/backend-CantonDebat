import { decodeJwtFromCookie } from '../../utils.js';

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/');
    next();
}

const privateAccess = (req, res, next) => {
    if (!req.session.user)  {
        console.log('Login needed to access this view')
        return res.redirect('/login');
    } 
    next();
}

const adminAccess = (req, res, next) => {
    if (!req.session.user || (req.session.user.role !== 'admin' && req.session.user.role !== 'premium')) {
        console.log('User role not authorized for this view')
        return res.redirect('/');
    }
    next();
}

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