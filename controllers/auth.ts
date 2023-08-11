import crypto from 'crypto'
import bcrypt from 'bcrypt'
import prisma from '../prisma'
import genToken from '../utils/genToken'
import { Request, Response, CookieOptions } from 'express'
const expressAsyncHandler = require('express-async-handler')

const newCookie: CookieOptions = process.env.NODE_ENV === 'production' ? {
    httpOnly: true,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
    sameSite: 'none',
    secure: true
} : {
    httpOnly: true,
    maxAge: 5 * 60 * 1000,
    secure: false // 5 mins
}

const signup = expressAsyncHandler(async (req: Request, res: Response) => {
    let { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({
            success: false,
            msg: "All fields are required."
        })
        return
    }

    username = username.trim().toLowerCase()
    const userExists = await prisma.users.findUnique({
        where: { username }
    })

    if (userExists) {
        res.status(409).json({
            success: false,
            msg: "Account already exists."
        })
        return
    }

    const ipAddress: string = req.ip
    const userAgent = req.headers['user-agent']

    if (!userAgent || !ipAddress) {
        res.status(400).json({
            success: false,
            msg: "Clear your browser cookies.. then try again."
        })
        return
    }

    const deviceId = { userAgent, ipAddress }
    password = await bcrypt.hash(password, 10)

    const newUser = await prisma.users.create({
        data: { username, password, deviceId }
    })

    res.status(201).json({
        success: true,
        msg: "Account creation was successful",
        data: newUser
    })
})

const login = expressAsyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({
            success: false,
            msg: "All fields are required."
        })
        return
    }

    const account = await prisma.users.findUnique({
        where: { username }
    })
    if (!account) {
        res.status(404).json({
            success: false,
            msg: "User not found."
        })
        return
    }

    const token: string = genToken(username, account?.deviceId!)

    await prisma.users.update({
        where: { username },
        data: { token }
    })

    res.cookie("auth", token, newCookie)
    res.sendStatus(200)
})

const logout = expressAsyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization
    if (!authHeader || authHeader.startsWith('Bearer')) {
        res.sendStatus(204)
        return
    }

    const account = await prisma.users.findUnique({
        where: {
            // @ts-ignore
            username: req.user.username
        }
    })

    if (!account) {
        res.sendStatus(204)
        return
    }

    await prisma.users.update({
        where: {
            // @ts-ignore
            username: req.user.username
        },
        data: {
            token: ""
        }
    })

    res.clearCookie("auth", newCookie)
    res.sendStatus(204)
})

const profile = expressAsyncHandler(async (req: Request, res: Response) => {
    const account = await prisma.users.findUnique({
        where: {
            // @ts-ignore
            username: req.user.username
        }
    })

    if (!account) {
        res.status(404).json({
            succces: false,
            msg: "User not found."
        })
    }

    res.status(200).json({
        account,
        success: true
    })
})

export { signup, login, logout, profile }