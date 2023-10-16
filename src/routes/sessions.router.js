import { Router } from 'express';
import usersModel from '../dao/models/users.model.js'
const router = Router();

//Primer servicio para registrar el usuario
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await usersModel.findOne({ email });

        if (exists) {
            return res.status(400).send({ status: 'error', message: 'User aflready exists' });
        }

        await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password
        });

        res.status(201).send({ status: 'success', message: 'User registered' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Intentando iniciar sesión con el email: ', email, 'password', password)
        const user = await usersModel.findOne({ email });

        if (!user || user.password !== password) {
            console.log('Verifique los datos ingresados')
            return res.status(400).send({ status: 'error', message: 'Nombre de usuario o contraseña incorrectos' });
            
        }

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        }

        res.send({ status: 'success', message: 'Sesión iniciada con éxito' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.status(500).send({ status: 'error', error: 'Error al cerrar sesión' });
        res.redirect('/');
        console.log('Sesión cerrada');
    })
});

export default router;