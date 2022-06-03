declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      POSTGRES_USER: string
      POSTGRES_PASSWORD: string
      POSTGRES_DB: string
      PSQL_URL: string
      MONGO_INITDB_ROOT_USERNAME: string
      MONGO_INITDB_ROOT_PASSWORD: string
      MONGO_DB_NAME: string
      MONGO_URL: string
      SMASHGG_API_KEY: string
      ACCESS_TOKEN_SECRET: string
      REFRESH_TOKEN_SECRET: string
      GOOGLE_APPLICATION_CREDENTIALS: string
      MAILGUN_USER: string
      MAILGUN_PASSWORD: string
    }
  }
}

export {}
