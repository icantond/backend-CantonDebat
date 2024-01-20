import { usersRepository } from '../repositories/index.js';

async function changeUserRole(userId, newRole) {
    try {
        const updatedUser = await usersRepository.changeUserRole(userId, newRole);
        return updatedUser;
    } catch (error) {
        console.error(error);
        throw new Error('Error al cambiar el rol de usuario');
    }
}

async function uploadDocuments(userId, documents) {
    try {
        await usersRepository.uploadDocuments(userId, documents);
    } catch (error) {
        console.error(error);
        throw new Error('Error al subir documentos');
    }
}

async function uploadProfile(userId, documents) {
    try {
        await usersRepository.upload(userId, documents);
    } catch (error) {
        console.error(error);
        throw new Error('Error al subir documentos');
    }
}

export {
    changeUserRole,
    uploadDocuments,
    uploadProfile
};