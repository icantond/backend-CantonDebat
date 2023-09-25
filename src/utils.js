import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, __dirname + '..' + 'public/img')
    },
    filename: function(req, file, cb){
        cb(null, path.join(__dirname, '..', 'public', 'img'));
    }
})
console.log(`dirname multer: ${__dirname + '\\static' + '\\img'}`);
const upload = multer({ storage });

export { __dirname, upload }
