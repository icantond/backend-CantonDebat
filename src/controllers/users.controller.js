import * as usersService from '../services/users.service.js';

async function changeUserRole(req, res) {
    const userId = req.params.uid;
    const newRole = req.body.role;

    try {
        if (req.session.user.role !== 'admin' || !['user', 'premium', 'admin'].includes(newRole)) {
            return res.status(403).send({ message: 'No tienes permisos para cambiar el rol de un usuario o el rol es inválido' });
        }

        const updatedUser = await usersService.changeUserRole(userId, newRole);

        if (!updatedUser) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        } else {
            return res.status(200).json({ message: 'Rol de usuario actualizado con éxito', data: updatedUser });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message || 'Error al cambiar el rol de usuario' });
    }
};

async function uploadDocuments(req, res, next) {
    try {
        const userId = req.params.uid;

        if (!req.files) {
            return res.status(400).json({ message: 'No documents uploaded.' });
        }

        const documents = req.files.map(file => ({
            name: file.originalname,
            reference: `/img/documents/${file.filename}`
        }));

        await usersService.uploadDocuments(userId, documents);

        res.status(200).json({ message: 'Documents uploaded successfully.' });
    } catch (error) {
        console.error(error);
        next(new CustomError('UploadDocumentsError', error.message || 'Error uploading documents.', 500));
    }
};

async function uploadProfile(req, res, next) {
    try {
        const userId = req.params.uid;

        if (!req.files) {
            return res.status(400).json({ message: 'No documents uploaded.' });
        }

        const documents = req.files.map(file => ({
            name: file.originalname,
            reference: `/img/documents/${file.filename}`
        }));

        await usersService.uploadProfile(userId, documents);

        res.status(200).json({ message: 'Documents uploaded successfully.' });
    } catch (error) {
        console.error(error);
        next(new CustomError('UploadDocumentsError', error.message || 'Error uploading documents.', 500));
    }
};

async function getAllUsers(req, res) {
    try {
        const users = await usersService.getAllUsers();
        const usersDetails = users.map(user => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }))
        res.status(200).json({ message: 'Usuarios obtenidos con éxito', data: usersDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    };
}

async function deleteInactiveUsers (req, res) {
    try {
        const users = await usersService.getAllUsers();
        const inactiveUsers = users.filter(user => user.last_connection < Date.now() - 2 * 24 * 60 * 60 * 1000);
        const deletedUsers = await usersService.deleteInactiveUsers(inactiveUsers);                 
        res.status(200).json({ message: 'Usuarios eliminados con éxito', data: deletedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar los usuarios' });
    };
}

export {
    changeUserRole,
    uploadDocuments,
    uploadProfile,
    getAllUsers, 
    deleteInactiveUsers
};