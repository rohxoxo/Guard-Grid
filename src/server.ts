import app from './app'
import config from './config/config'
import logger from './util/logger'
import connectDB from './services/db'

const server = app.listen(config.PORT, '0.0.0.0', () => {
  logger.info(`Server listening on ${config.SERVER_URL}:${config.PORT}`)
})

;(async (): Promise<void> => {
  try {
    await connectDB()
    logger.info('Application Started', {
      meta: {
        PORT: config.PORT,
        SERVER_URL: `${config.SERVER_URL}:${config.PORT}`
      }
    })
  } catch (err) {
    logger.error('Application Error', { meta: err })

    // ✅ Type-safe close with callback
    server.close((error) => {
      if (error) {
        logger.error(`Server closed due to ${error}`, { meta: error })
      }
    })
    process.exit(1)
  }
})()
