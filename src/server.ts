import express from 'express'
import dotenv from 'dotenv'
import { userRouter, musicRouter } from './routes'
import { errorHandler } from './middlewares/errorHandler'

dotenv.config()
const app = express()
const port = process.env.PORT || 3333

// ==> Middlewares
app.use(express.json())

// ==> Routes
app.use('/users', userRouter)
app.use('/musics', musicRouter)

// ==> Global Error Handler
app.use(errorHandler)

app.listen(port, () => console.log(`Server running at PORT ${port}`))
