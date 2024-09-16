import express from 'express'
import dotenv from 'dotenv'
import { userRouter, musicRouter } from './routes'
import { errorHandler } from './middlewares/errorHandler'
import path from 'path'
import globalPathMiddleware from './utils/path'
import { fileURLToPath } from 'url'

// ==> Configuration
dotenv.config()
const app = express()
const port = process.env.PORT || 3333

// ==> Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==> Middlewares
app.use(express.json())
app.use(globalPathMiddleware)
app.use('/chords', express.static(path.join(__dirname, '../public/chords')))

// ==> Routes
app.use('/users', userRouter)
app.use('/musics', musicRouter)

// ==> Global Error Handler
app.use(errorHandler)

app.listen(port, () => console.log(`Server running at PORT ${port}`))
