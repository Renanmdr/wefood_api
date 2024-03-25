import express from 'express'
const router = express.Router()

import { FoodController } from '../controllers/FoodController.js'
import { verifyToken } from '../helpers/verify-token.js'
import { imageUpload } from '../helpers/image-upload.js'
router.get('/', (_, res) => {
  return res.send('Olá DEV!');
});
router.post('/foods/create', verifyToken, imageUpload.array('images') ,FoodController.create)
router.get('/foods/', FoodController.getAll)
router.get('/foods/myfoods', verifyToken, FoodController.getAllUserFoods)
router.get('/foods/myfavorites', verifyToken, FoodController.getAllMyfavorites)
router.get('/foods/:id', FoodController.getFoodById)
router.delete('/foods/:id', verifyToken, FoodController.removePetById)
router.patch('/foods/:id', verifyToken, imageUpload.array('images'), FoodController.updateFood)
router.patch('/foods/favorite/:id', verifyToken,  FoodController.favorite)

export {router}