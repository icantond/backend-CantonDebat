import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        // cb(null, path.join(__dirname + '../public/img'));
        cb(null, path.join(__dirname + '../public/img'));

    },

    filename: function (req, file, cb) {
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.originalname}`;
        cb(null, uniqueFilename);
    },

});
console.log(`dirname multer: ${__dirname + '\\static' + '\\img'}`);

const upload = multer({ storage });

export { __dirname, upload }
