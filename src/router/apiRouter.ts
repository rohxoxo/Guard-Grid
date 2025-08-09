import { Router } from 'express'
import apiController from '../controller/apiController'
import guardsRouter from './guardsRouter'

const router = Router()

// Health check endpoint
router.route('/self1').get(apiController.self)

// Guards routes
router.use('/guards', guardsRouter)

export default router
