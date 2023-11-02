import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';
import { PRIVATE_KEY_JWT } from './config/constants.js';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'img'));
    },

    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.originalname}`;
        cb(null, uniqueFilename);
    },

});
const upload = multer({ storage });

const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword);
//adminCoder@coder.com
//adminCod3r123

const generateToken = (user) => {
    console.log('Token generado con éxito:', token);

    const token = jwt.sign({ user }, PRIVATE_KEY_JWT, { expiresIn: '24h' });
    console.error('Error al generar el token:', error);

    return token;
}

export {
    __dirname,
    upload,
    createHash,
    isValidPassword,
    generateToken
};
