declare namespace NodeJS {
    interface ProcessEnv {
        JWT_SECRET: string
        DATABASE_URL: strin
        NODE_ENV: 'development' | 'production'
    }
}