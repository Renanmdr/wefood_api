import { Router } from 'express'
const router = Router()
import { UserController } from '../controllers/UserController.js'

// middleware to validate token
import { verifyToken } from '../helpers/verify-token.js'
// image upload
import { imageUpload } from '../helpers/image-upload.js'

router.post('/users/register', UserController.resgister)
router.post('/users/login', UserController.login)
router.get('/users/checkuser', UserController.checkUser)
router.get('/users/:id', UserController.getUserById)
router.patch('/users/edit/:id', verifyToken, imageUpload.single('image'), UserController.editUser)



export {router}

