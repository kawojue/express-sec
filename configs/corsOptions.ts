import { CorsOptions } from 'cors'

const allowedOrigins: string[] = ['CLIENT_URL']

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
            callback(null, true)
        } else {
            throw new Error('Not allowed!')
        }
    },
    credentials: true,
    methods: 'GET,POST',
    optionsSuccessStatus: 200,
}

export { corsOptions }