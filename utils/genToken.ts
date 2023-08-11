import jwt, { Secret } from 'jsonwebtoken'

const genToken = (username: string, deviceId: any) => {
    const token: Secret = jwt.sign(
        { username, deviceId },
        process.env.JWT_SECRET as string,
        { expiresIn: '90d' }
    )
    return token
}

export default genToken