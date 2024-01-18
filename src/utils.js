import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';
import { fakerES as faker } from '@faker-js/faker';
import configs from './config/config.js'
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __mainDirname = path.join(__dirname, '..');

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

// const documentsStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(__dirname, '..', 'public', 'img', 'documents'));
//     },
//     filename: function (req, file, cb) {
//         const timestamp = Date.now();
//         const uniqueFilename = `${timestamp}-${file.originalname}`;
//         cb(null, uniqueFilename);
//     },
// });

// const documentsUpload = multer({ storage: documentsStorage });
const documentsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.body.type || 'document'; // Por defecto, si no se proporciona, será un documento.
        const destinationFolder = type === 'profile' ? 'profile' : 'documents';

        cb(null, path.join(__dirname, '..', 'public', 'img', destinationFolder));
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.originalname}`;
        cb(null, uniqueFilename);
    },
});
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'public', 'img', 'profile'));
    },
    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.originalname}`;
        cb(null, uniqueFilename);
    },
});


const uploadDocuments = multer({ storage: documentsStorage });
const uploadProfile = multer({ storage: profileStorage });

const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword);
//adminCoder@coder.com
//adminCod3r123


const generateToken = (email) => {
    const token = jwt.sign({ email }, configs.jwtKey, { expiresIn: '1h' });
    console.log('generated token: ', token, 'for email ', email)
    return token;
    
};

const decodeJwtFromCookie = (token) => {
    try {
        console.log('decoding cookie: ', token);
            // const token = userCookie.split('= ')[1]; 
        const decodedToken = jwt.verify(token, configs.jwtKey);
        return decodedToken;
    } catch (error) {
        console.error(error);
        return null;
    }
};


const generateMockProduct = () => {
    return{
        title: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: faker.commerce.price(),
        id: faker.database.mongodbObjectId(),
        stock: faker.number.int({ min: 1, max: 100 }),
        thumbnail: faker.image.url(),
        status: faker.datatype.boolean(),
        code: faker.string.alphanumeric({ length: 6 })
    }
};

export {
    __dirname,
    upload,
    // documentsUpload,
    uploadDocuments,
    uploadProfile,
    __mainDirname,
    createHash,
    isValidPassword, 
    generateToken,
    generateMockProduct,
    decodeJwtFromCookie
};
