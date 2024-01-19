import * as SessionsService from '../services/sessions.service.js'

async function registerUser(req, res) {
    try {
        const result = await SessionsService.registerUser(req.body);

        if (result.status === 'success') {
            req.logger.info(`Se ha creado el usuario con el correo ${req.body.email}`);
            res.status(200).send(result);
        } else {
            req.logger.error(`Error al registrar usuario: ${result.message}`);
            res.status(400).send(result);
        }
    } catch (error) {
        req.logger.error(`Error al registrar usuario: ${error.message}`);
        res.status(500).send({ status: 'error', message: 'Internal server error' });
    }
};

async function loginUser(req, res) {
    req.logger.debug(`Attempting to login with email: ${req.body.email}`);

    try {
        const { email, password } = req.body;
        const result = await SessionsService.loginUser(email, password);

        req.session.user = result.user;

        res.cookie('userCookie', result.token, { maxAge: 3600000, httpOnly: true })
            .send({ status: 'success', message: 'Login Successful', token: result.token });

        req.logger.info(`Login successful for email: ${email}`);
    } catch (error) {
        req.logger.error(`Error during login: ${error.message}`);
        res.status(500).send({ status: 'error', message: error.message });
    }
};

async function logoutUser(req, res) {
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
};

async function handleGithubAuth(req, res) {
    res.send({ status: 'success', message: 'user registered' });
};

async function handleGithubCallback(req, res) {
    try {
        const githubUser = req.user;
        const user = await SessionsService.handleGithubCallback(githubUser);

        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        req.logger.error(`Error during GitHub callback handling: ${error.message}`);
        res.status(500).send({ status: 'error', message: error.message });
    }
};

async function sendPasswordResetLink(req, res) {
    try {
        const userEmail = req.body.email;
        console.log('Intentando reestablecer contraseña user ', userEmail);

        const sentTo = await SessionsService.sendPasswordResetLink(userEmail);

        res.status(200).json({
            message: `Se ha enviado un enlace de restablecimiento de contraseña al correo ${sentTo}.`
        });
    } catch (error) {
        req.logger.error(`Error during password reset link sending: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

async function resetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const userEmail = await SessionsService.resetPassword(token, password);

        res.status(200).json({
            message: `Contraseña restablecida exitosamente para el usuario: ${userEmail}`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    handleGithubAuth,
    handleGithubCallback,
    sendPasswordResetLink,
    resetPassword,
    currentUser
};