    import { Router } from 'express';
import * as SessionsController from '../controllers/sessions.controller.js';
import passport from 'passport';

const router = Router();

router.post('/register', SessionsController.registerUser);
router.post('/login', SessionsController.loginUser);
router.get('/logout', SessionsController.logoutUser);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.send({ status: 'success', message: 'user registered' });
});

router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

export default router;


// import { Router } from 'express';
// import usersModel from '../dao/models/users.model.js'
// import { createHash, isValidPassword } from '../utils.js';
// import passport from 'passport';

// const router = Router();

// //Primer servicio para registrar el usuario
// router.post('/register', async (req, res) => {
//     try {
//         const { first_name, last_name, email, age, password } = req.body;
//         const exists = await usersModel.findOne({ email });

//         if (exists) {
//             return res.status(400).send({ status: 'error', message: 'User aflready exists' });
//         }

//         await usersModel.create({
//             first_name,
//             last_name,
//             email,
//             age,
//             password: createHash(password)
//         });

//         res.status(201).send({ status: 'success', message: 'User registered' });
//     } catch (error) {
//         res.status(500).send({ status: 'error', message: error.message })
//     }
// });

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log(email, password)
//         // console.log('Intentando iniciar sesión con el email: ', email, 'password', password)
//         const user = await usersModel.findOne({ email });

//         if (!user) {
//             console.log('Verifique los datos ingresados')
//             return res.status(401).send({ status: 'error', message: 'Nombre de usuario o contraseña incorrectos' });
//         }

//         if(!isValidPassword(password, user.password)){
//         console.log('Verifique los datos ingresados')
//         return res.status(401).send({ status: 'error', message: 'Nombre de usuario o contraseña incorrectos' });
//         }
        
//         console.log('Iniciando sesión con el email: ', email, 'password', password)
//         req.session.user = {
//             name: `${user.first_name} ${user.last_name}`,
//             email: user.email,
//             age: user.age,
//             role: user.role
//         }

//         res.send({ status: 'success', message: 'Sesión iniciada con éxito' });
//     } catch (error) {
//         res.status(500).send({ status: 'error', message: error.message })
//     }
// });

// router.get('/logout', (req, res) => {
//     req.session.destroy(error => {
//         if(error) return res.status(500).send({ status: 'error', error: 'Error al cerrar sesión' });
//         res.redirect('/');
//         console.log('Sesión cerrada');
//     })
// });



// export default router;