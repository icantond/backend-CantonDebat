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
}

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
}

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
}

export {
    changeUserRole,
    uploadDocuments,
    uploadProfile
};
// import { usersRepository } from '../repositories/index.js';


// async function changeUserRole(req, res) {
//     const userId = req.params.uid;
//     const newRole = req.body.role;

//     try {
        
//         if (req.session.user.role !== 'admin' || !['user', 'premium'].includes(newRole)) {
//             return res.status(403).send({ message: 'No tienes permisos para cambiar el rol de un usuario o el rol es inválido' });
//         }

//         // Cambiar el rol del usuario
//         const updatedUser = await usersRepository.changeUserRole(userId, newRole);

//         if (!updatedUser) {
//             return res.status(404).send({ message: 'Usuario no encontrado' });
//         } else {
//             return res.status(200).json({ message: 'Rol de usuario actualizado con éxito', data: updatedUser });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Error al cambiar el rol de usuario' });
//     }
// }


// async function uploadDocuments(req, res, next) {
//     try {
//         const userId = req.params.uid;

//         if (!req.files) {
//             return res.status(400).json({ message: 'No documents uploaded.' });
//         }

//         const documents = req.files.map(file => ({
//             name: file.originalname,
//             reference: `/img/documents/${file.filename}`
//         }));


//         await usersRepository.uploadDocuments(userId, documents);

//         res.status(200).json({ message: 'Documents uploaded successfully.' });
//     } catch (error) {
//         console.error(error);
//         next(new CustomError('UploadDocumentsError', 'Error uploading documents.', 500));
//     }
// };
// async function uploadProfile(req, res, next) {
//     try {
//         const userId = req.params.uid;

//         if (!req.files) {
//             return res.status(400).json({ message: 'No documents uploaded.' });
//         }

//         const documents = req.files.map(file => ({
//             name: file.originalname,
//             reference: `/img/documents/${file.filename}`
//         }));


//         await usersRepository.upload(userId, documents);

//         res.status(200).json({ message: 'Documents uploaded successfully.' });
//     } catch (error) {
//         console.error(error);
//         next(new CustomError('UploadDocumentsError', 'Error uploading documents.', 500));
//     }
// }
// export {
//     changeUserRole,
//     uploadDocuments,
//     uploadProfile
// };