import authRouter from './auth'
import { Router } from 'express'

const root: Router = Router()

root.use('/auth', authRouter)

export default root