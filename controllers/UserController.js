import { createUsertoken } from '../helpers/create-user-token.js'
import { User } from '../models/User.js'
import bcrypt from 'bcrypt'
import { getToken } from '../helpers/get-token.js'
import jwt from 'jsonwebtoken'
import { getUserByToken } from '../helpers/get-user-by-token.js'


export  class UserController {
    static async resgister(req, res){
        const {name, email, password, confirmpassword} = req.body

        if(!name){
          return  res.status(422).json({message: 'O nome é obrigatorio!'})

        }

        if(!email){
          return  res.status(422).json({message: 'O e-mail é obrigatorio!'})

        }

        if(!password){
          return  res.status(422).json({message: 'A senha é obrigatoria!'})

        }

        if(!confirmpassword){
          return  res.status(422).json({message: 'A confirmação de senha é obrigatoria!'})

        }

        if(password !== confirmpassword){
          return  res.status(422).json({message: 'A senha e a confirmação de senha precisam ser iguais!!'})

        }

        // check if user exists

        const userExists = await User.findOne({email})

        if(userExists){
         return  res.status(422).json({message: 'Por favor, utilize outro e-email'})
        }
        
        // create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create a user
        const user = new User({
            name,
            email,
            password: passwordHash
        })

        try {
           const newUser = await user.save()
           await createUsertoken(newUser, req, res)
          
        } catch (error) {
            return res.status(500).json({message: error})
        }
        
    }

    static async login(req, res) {
      const { email, password } = req.body

      if(!email){
        return res.status(422).json({message: 'O e-mail é obrigatorio!'})
      }

       if(!password){
        return res.status(422).json({message: 'A senha é obrigatoria!'})
      }

      const user = await User.findOne({email})

      // check if user exists
      if(!user){
        return res.status(422).json({message: 'Não há usuario cadastrado com esse e-mail'})
      }

      // check if password match with db password
      const checkPassword = await bcrypt.compare(password, user.password)
      
     
      if(!checkPassword){
        return res.status(422).json({message: 'Senha invalida!'})
      }


      await createUsertoken(user, req, res)
      
    }

    static async checkUser(req, res){
      let currentUser;


      if(req.headers.authorization){
        const token = getToken(req) 
    
        const decoded = jwt.verify(token, 'nossosecret')
         currentUser = await User.findById(decoded.id)

         currentUser.password = undefined
      }else{
        currentUser = null
      }

      res.status(200).json(currentUser)
    }

    static async getUserById(req, res){
      const id = req.params.id

      const user =  await User.findById(id).select('-password')

      if(!user){
        return res.status(422).json({message: "Usuario não encontrado!"})
      }

      res.status(200).json({user})
    }

    static async editUser(req, res){
      // check if user exist
      const token = getToken(req)
      const user = await getUserByToken(token)

      if(!user){
        return res.status(422).json({message: 'Usuario não encontrado!'})

      }
      const {name, email, password, confirmpassword} = req.body

      //let image = ''

      if(req.file){
        user.image =  req.file.filename
      }
    


       if(!name){
          return  res.status(422).json({message: 'O nome é obrigatorio!'})

        }

        user.name = name

        if(!email){
          return  res.status(422).json({message: 'O e-mail é obrigatorio!'})

        }

        const userExist =  await User.findOne({email})

      if(user.email !== email && userExist){
        return res.status(422).json({message: 'Por favor , utilize outro e-mail!'})

      }

      user.email = email

        // if(!password){
        //   return  res.status(422).json({message: 'A senha é obrigatoria!'})

        // }

        // if(!confirmpassword){
        //   return  res.status(422).json({message: 'A confirmação de senha é obrigatoria!'})

        // }

        if(password !== confirmpassword){
          return  res.status(422).json({message: 'A senha e a confirmação de senha precisam ser iguais!!'})

        }else if(password === confirmpassword && password != null){
          const salt = await bcrypt.genSalt(12)
          const passwordHash = await bcrypt.hash(password, salt)

          user.password = passwordHash
        }

       

        try {
          await User.findOneAndUpdate({_id: user._id}, {$set: user}, {new: true})
          res.status(200).json({message: 'Usuário atualizado com sucesso!' })
        } catch (error) {
         return res.status(500).json({message: err})
        }
      
      
    }
}