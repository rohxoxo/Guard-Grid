import dotenvFlow from 'dotenv-flow'

dotenvFlow.config()

export default {
  // General
  ENV: process.env.ENV,
  PORT: Number(process.env.PORT) || 3000,
  SERVER_URL: process.env.SERVER_URL,
  // Database
  DATABASE_URL: process.env.DATABASE_URL
}
