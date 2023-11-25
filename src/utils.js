import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';
import { fakerES as faker } from '@faker-js/faker';

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
    createHash,
    isValidPassword, 
    generateMockProduct
};
