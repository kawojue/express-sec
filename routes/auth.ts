import { Router } from 'express'
import { signup, login } from '../controllers/auth'

const authRouter: Router = Router()

authRouter.post('/login', login)
authRouter.post('/signup', signup)

export default authRouter