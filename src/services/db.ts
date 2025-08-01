import mongoose from 'mongoose'
import logger from '../util/logger'
import config from '../config/config'

const connectDB = async () => {
  try {
    if (!config.DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined in config')
    }
    await mongoose.connect(config.DATABASE_URL)
    logger.info('Database connected')
  } catch (error) {
    logger.error('Database connection error:', error)
  }
}

export default connectDB
