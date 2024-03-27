import  express  from "express";
import  cors  from 'cors'
import 'dotenv/config.js'
// import { router } from './routes/UserRoutes'
import { router as UserRoutes } from "./routes/UserRoutes.js";
import { router as FoodRoutes } from "./routes/FoodRoutes.js";
// const express = require('express')
// const cors = require('cors')
const app = express()


//config json response
app.use(express.json())

// solve cors 
app.use(cors({ Credential: true, origin: 'https://endearing-gumption-98c016.netlify.app'}))

// public folder for images 
//app.use(express.static('public'))
app.use('/files', express.static('public/images/foods'))

// routes
app.use(UserRoutes)
app.use(FoodRoutes)

app.listen(5000)



