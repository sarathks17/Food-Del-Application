import dotenv from 'dotenv'
dotenv.config();


import express from 'express'
import cors from 'cors'
import { connectDB } from './Config/db.js'
import userRouter from './routes/userRoutes.js'

import orderRouter from './routes/orderRoute.js'


const app = express()
const port = 4000

app.use(express.json())
app.use(cors())

connectDB();

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.use("/api/user",userRouter)
app.use("/api/order",orderRouter)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });


app.get("/",(req,res)=> {
    res.send('API Working')
})

app.listen(port,() => {
    console.log("server is running")
})