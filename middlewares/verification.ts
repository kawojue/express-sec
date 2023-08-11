import jwt from 'jsonwebtoken'
import prisma from '../prisma'
import compareObjects from '../utils/compareObj'
import { NextFunction, Request, Response } from 'express'
const expressAsyncHandler = require('express-async-handler')


const verify = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const deviceId = {
        userAgent: req.headers['user-agent'],
        ipAddress: req.socket.remoteAddress?.split(":")[3],
    }

    if (!authHeader || !authHeader?.startsWith('Bearer')) {
        res.status(401).json({
            success: false,
            msg: "Access denied"
        })
        return
    }

    const token: string = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.JWT_SECRET!,
        async (err: any, decoded: any) => {
            if (err) {
                res.status(403).json({
                    success: false,
                    msg: "Access denied"
                })
                return
            }

            const account = await prisma.users.findFirst({
                where: { token }
            })

            const authDeviceId = account?.deviceId
            const decodedDeviceId = decoded.deviceId

            const result: boolean = compareObjects([authDeviceId, decodedDeviceId, deviceId])

            if (!result) {
                res.status(403).json({
                    success: false,
                    msg: "Unauthorized IP or Device"
                })
                return
            }

            // @ts-ignore
            req.user = decoded
            next()
        }
    )
})

export default verify