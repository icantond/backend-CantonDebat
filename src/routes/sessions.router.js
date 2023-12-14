import { Router } from 'express';
import * as SessionsController from '../controllers/sessions.controller.js';
import passport from 'passport';
import { addLogger } from '../utils/logger.js';

const router = Router();

router.post('/register', SessionsController.registerUser);
router.post('/login', addLogger, SessionsController.loginUser);
router.get('/logout', addLogger, SessionsController.logoutUser);
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), SessionsController.handleGithubAuth);
router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), SessionsController.handleGithubCallback);
router.post('/forgot-password', SessionsController.sendPasswordResetLink);
router.post('/reset-password', SessionsController.sendPasswordResetLink);

export default router;
