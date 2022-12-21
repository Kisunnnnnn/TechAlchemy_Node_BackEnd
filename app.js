const express = require('express')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')


dotenv.config({ path: './config/config.env' })


mongoose.set("strictQuery", false)
const db = process.env.DATABASE

mongoose.connect(db).then(() => {
    console.log("Database Connected")
}).catch(err => console.log("Error connecting database", err.message))


const app = express()
app.use(cors())
app.use(bodyparser.json())
app.use('/', require('./routes/data'))

module.exports = app