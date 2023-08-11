declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string
        DATABASE_URL: string
        SESSION_SECRET: string
        NODE_ENV: 'development' | 'production'
    }
}