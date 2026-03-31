import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';


// Como você está usando ES Modules (import), precisamos disso para o resolve:
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default{
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, cb)=>{
            crypto.randomBytes(16,(err, res)=>{
                if(err){
                    return cb(err);
                }
                //Retorna o nome único: hash + .jpg (ou .png, etc)
                return cb(null, res.toString("hex")+ extname(file.originalname));
            })
        }
}),
}