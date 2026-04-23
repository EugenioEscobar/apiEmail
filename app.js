const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const corsMiddleware = require('./middleware/cors')
const rateLimiter = require('./middleware/rateLimiter')
const errorHandler = require('./middleware/errorHandler')
const contactoRouter = require('./routes/contacto')

const app = express()

app.set('trust proxy', 1)

app.use(corsMiddleware)
app.use(express.json())
app.use(rateLimiter)

app.use('/contacto', contactoRouter)

app.use(errorHandler)

module.exports = app
