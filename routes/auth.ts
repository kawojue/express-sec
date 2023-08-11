import { Router } from 'express'
import verify from '../middlewares/verification'
import { signup, login, profile, logout } from '../controllers/auth'

const authRouter: Router = Router()

authRouter.post('/login', login)
authRouter.post('/signup', signup)

authRouter.get('/logout', verify, logout)
authRouter.get('/profile', verify, profile)

export default authRouter