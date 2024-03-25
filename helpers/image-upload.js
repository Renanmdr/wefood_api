import multer from "multer";
import path from 'path'

// Destination to store the images
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb){
        let folder = ''

        if(req.baseUrl.includes('users')){
            folder = 'users'
        }else if(req.baseUrl.includes('foods')){
            folder = 'foods'
        }

        cb(null, `public/images/${folder}`)
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
    },
})


export const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg|webp|jpeg)$/)){
            return cb(new Error('Por favor, envie apenas jpg ou png!'))
        }
        cb(undefined, true)
    }
})

