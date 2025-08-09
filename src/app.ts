import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import router from './router/apiRouter'
import globalErrorHandler from './middleware/globalErrorHandler'
import responseMessage from './constant/responseMessage'
import httpError from './util/httpError'

const app: Application = express()

//Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, '../', 'public')))

//Routes
app.use('/api/v1', router)

//404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const errorMessage = responseMessage.NOT_FOUND('route')
  const error = new Error(errorMessage)
  res.status(404).json({
    success: false,
    statusCode: 404,
    request: {
      ip: req.ip || null,
      meathod: req.method,
      url: req.originalUrl
    },
    message: errorMessage,
    data: null
  })
  httpError(next, error, req, 404)
})

//global error handler
app.use(globalErrorHandler)

export default app
