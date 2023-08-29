const express = require('express')

const cors = require('cors')
require('dotenv').config();

const app = express()

app.use(express.json())
app.use(cors({origin:true}))

app.listen(3001, ()=>{
    console.log(`Server running on port 3001`)
})