import express from 'express'
const router = express.Router()

import { FoodController } from '../controllers/FoodController.js'
import { verifyToken } from '../helpers/verify-token.js'
import { imageUpload } from '../helpers/image-upload.js'

router.post('/create', verifyToken, imageUpload.array('images') ,FoodController.create)
router.get('/', FoodController.getAll)
router.get('/myfoods', verifyToken, FoodController.getAllUserFoods)
router.get('/myfavorites', verifyToken, FoodController.getAllMyfavorites)
router.get('/:id', FoodController.getFoodById)
router.delete('/:id', verifyToken, FoodController.removePetById)
router.patch('/:id', verifyToken, imageUpload.array('images'), FoodController.updateFood)
router.patch('/favorite/:id', verifyToken,  FoodController.favorite)

export {router}