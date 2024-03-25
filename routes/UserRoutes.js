import { Router } from 'express'
const router = Router()
import { UserController } from '../controllers/UserController.js'

// middleware to validate token
import { verifyToken } from '../helpers/verify-token.js'
// image upload
import { imageUpload } from '../helpers/image-upload.js'

router.post('/register', UserController.resgister)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id', verifyToken, imageUpload.single('image'), UserController.editUser)



export {router}

