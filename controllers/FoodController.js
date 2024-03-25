import { getToken } from '../helpers/get-token.js'
import { getUserByToken } from '../helpers/get-user-by-token.js'
import { Food } from '../models/Food.js'
import  { Types }  from 'mongoose'
const { ObjectId } = Types

export class FoodController {
    static async create(req, res){
        const {name, ingredients, instructions, time, portions} = req.body

        // images upload
        const images = req.files
        // validations
        if(!name){
            return res.status(422).json({message: 'O nome é obrigatorio!'})
        }

        if(!ingredients){
            return res.status(422).json({message: 'Os igredientes são obrigatorios!'})
        }

        if(!instructions){
            return res.status(422).json({message: 'As instruções sãp obrigatorias!'})
        }

        if(!time){
            return res.status(422).json({message: 'O tempo de preparo é obrigatorio'})
        }

        if(!portions){
            return res.status(422).json({message: 'As porções são obrigatorias'})
        }

        

        if(images.length === 0){
            return res.status(422).json({message: 'A imagem é obrigatorias'})
        }
      

        // recipe owner
        const token = getToken(req)
        const user = await getUserByToken(token)
       
        const food = new Food({
            name,
            ingredients,
            instructions,
            time,
            portions,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image
            }

        })

          images.map((image) => {
            food.images.push(image.filename)
        })

        try {
            const newFood = await food.save()
            res.status(201).json({message: 'Receita cadastrada com sucesso!', newFood})
        } catch (error) {
           return res.status(500).json({message: error})
        }
        
    }

    static async getAll(req, res){
        const foods =  await Food.find().sort('-createdAt')
        
        res.status(200).json({
            foods: foods
        })

    }

    static async getAllUserFoods(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)

        const foods = await Food.find({'user._id':user._id}).sort('-createdAt')

        res.status(200).json({
            foods: foods
        })
    }

    static async getAllMyfavorites(req, res){
        const token = getToken(req)
        const user = await getUserByToken(token)

        const foods = await Food.find({'favorites._id':user._id}).sort('-createdAt')

        res.status(200).json({
            foods: foods
        })

    }

    static async getFoodById(req, res){
        const id = req.params.id
        if(!ObjectId.isValid(id)){
            return res.status(402).json({message: 'ID inválido!'})
        }

        const food = await Food.findById({_id: id})

        if(!food){
            return res.status(404).json({message: 'Receita não encontrada!'})
        }

        res.status(200).json({
            food: food
        })
    }

    static async removePetById(req, res){
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            return res.status(422).json({message: 'ID inválido!'})
        }

         const food = await Food.findById({_id: id})

        if(!food){
            return res.status(404).json({message: 'Receita não encontrada!'})
        }

        const token = getToken(req)
        const user = await getUserByToken(token)
        

        if(user._id.toString() !== food.user._id.toString()){
          return  res.status(422).json({message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'})
        }

        await Food.findByIdAndDelete(id)

        res.status(200).json({message: 'Receita removida com sucesso!'})
    }

    static async updateFood(req, res){
        const id = req.params.id

         const {name, ingredients, instructions, time, portions} = req.body

         const images = req.files

         const updateData = {}

          if(!ObjectId.isValid(id)){
            return res.status(422).json({message: 'ID inválido!'})
        }

         const food = await Food.findById({_id: id})

        if(!food){
            return res.status(404).json({message: 'Receita não encontrada!'})
        }

         const token = getToken(req)
        const user = await getUserByToken(token)
        

        if(user._id.toString() !== food.user._id.toString()){
          return  res.status(422).json({message: 'Houve um problema em processar a sua solicitação, tente novamente mais tarde!'})
        }

            // validations
        if(!name){
            return res.status(422).json({message: 'O nome é obrigatorio!'})
        }

        updateData.name = name

        if(!ingredients){
            return res.status(422).json({message: 'Os igredientes são obrigatorios!'})
        }

        updateData.ingredients = ingredients

        if(!instructions){
            return res.status(422).json({message: 'As instruções sãp obrigatorias!'})
        }

        updateData.instructions = instructions

        if(!time){
            return res.status(422).json({message: 'O tempo de preparo é obrigatorio'})
        }
        
        updateData.time = time

        if(!portions){
            return res.status(422).json({message: 'As porções são obrigatorias'})
        }

        updateData.portions = portions

        if(images.length > 0){
            updateData.images = []
            images.map((image) => {
            updateData.images.push(image.filename)
        })
        }

        

        await Food.findByIdAndUpdate(id, updateData)

        res.status(200).json({message: 'Receita atualizada com sucesso!'})
    }

    static async favorite(req, res){
        const id = req.params.id 

        if(!ObjectId.isValid(id)){
            return res.status(422).json({message: 'ID inválido!'})
        }

        const food = await Food.findById(id)

          if(!food){
            return res.status(404).json({message: 'Receita não encontrada!'})
        }

        const token = getToken(req)
        const user = await getUserByToken(token)
        

        if(user._id.equals(food.user._id)){
          return  res.status(422).json({message: 'Você não pode favoritar sua propria receita!'})
        }

        // check if user already favorite

        if(food.favorites){
            if(food.favorites._id.equals(user._id)){
                return res.status(422).json({message: 'Você ja favoritou essa receita!'})
            }
        }

        food.favorites = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Food.findByIdAndUpdate(id, food)

        res.status(200).json({message: 'A receita foi salva com sucesso!'})

    }
}