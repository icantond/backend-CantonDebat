import { Router } from 'express';
import * as SessionsController from '../controllers/sessions.controller.js';
import passport from 'passport';
import { addLogger } from '../utils/logger.js';

const router = Router();

router.post('/register', SessionsController.registerUser);
router.post('/login', addLogger, SessionsController.loginUser);
router.get('/logout', addLogger, SessionsController.logoutUser);
router.get('/current', SessionsController.currentUser);
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), SessionsController.handleGithubAuth);
router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), SessionsController.handleGithubCallback);
router.post('/forgot-password', SessionsController.sendPasswordResetLink);
router.post('/api/sessions/reset-password/:token', SessionsController.resetPassword);
// router.put('/premium/:uid', SessionsController.changeUserRole);
router.get('/mostrar-cookie', (req, res) => {
    // Obtener el valor de la cookie llamada "cookieEjemplo"
    const valorCookie = req.cookies.userCookie;
    res.send(`El valor de la cookie es: ${valorCookie}`);
});


export default router;
