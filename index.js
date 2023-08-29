const express = require('express')

const cors = require('cors')
require('dotenv').config();

const app = express()

app.use(express.json())
app.use(cors({origin:true}))

const userRouter = require('./routes/Users')
app.use("/auth", userRouter);


app.listen(3001, ()=>{
    console.log(`Server running on port 3001`)
})