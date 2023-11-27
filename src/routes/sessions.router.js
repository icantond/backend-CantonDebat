import { Router } from 'express';
import * as SessionsController from '../controllers/sessions.controller.js';
import passport from 'passport';

const router = Router();

router.post('/register', SessionsController.registerUser);
router.post('/login', SessionsController.loginUser);
router.get('/logout', SessionsController.logoutUser);
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), SessionsController.handleGithubAuth);
router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), SessionsController.handleGithubCallback);

export default router;
