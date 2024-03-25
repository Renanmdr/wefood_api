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
app.use(cors({ Credential: true, origin: 'http://localhost:5173'}))

// public folder for images 
app.use(express.static('public'))

// routes
app.use('/users', UserRoutes)
app.use('/foods', FoodRoutes)

app.listen(5000)



