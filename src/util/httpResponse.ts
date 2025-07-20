import { Request, Response } from 'express'
import { THttpError } from '../types/types'
import config from '../config/config'
import { EApplicationEnvironment } from '../constant/application'
import logger from './logger'

export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null): void => {
  const response: THttpError = {
    success: true,
    statusCode: responseStatusCode,
    request: {
      ip: req.ip || null,
      meathod: req.method,
      url: req.originalUrl
    },
    message: responseMessage,
    data: data
  }

  // Log
  logger.info('Controller_Response', {
    meta: response
  })

  // Production Env Check
  if (config.ENV === EApplicationEnvironment.PRODUCTION) {
    delete response.request.ip
  }

  res.status(responseStatusCode).json(response)
}
