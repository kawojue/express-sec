import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import logger from 'morgan'
import root from './routes/root'
import express, { Application } from 'express'
import { corsOptions } from './configs/corsOptions'

const app: Application = express()

const PORT: unknown = process.env.PORT || 3030

app.use(logger('dev'))
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', root)

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})