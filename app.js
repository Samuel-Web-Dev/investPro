require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')

const app = express()

const authRouter = require('./routes/auth')
const investorRouter = require('./routes/user')
const adminRouter = require('./routes/admin')

app.use(helmet())
app.use(compression())
app.use(express.json())

app.use(cors());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})


app.use(authRouter)
app.use('/investor', investorRouter)
app.use('/admin', adminRouter)


app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message
    res.status(status).json({message: message})
})


mongoose.connect(`mongodb+srv://${process.env.USERNAM}:${process.env.PASSWORD}@first-project.y8uqnxq.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=first-project`).then(() => {
    console.log('Connected to Database Successfully')
    app.listen(3000)
}).catch((err) => {
    console.log(err);
    
})