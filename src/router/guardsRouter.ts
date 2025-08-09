import { Router } from 'express'
import guardsController from '../controller/guardsController'
import { validateCreateGuard, validateUpdateGuard, validateGuardQuery } from '../middleware/guardValidation'

const router = Router()

// Basic CRUD Operations
router.route('/').get(validateGuardQuery, guardsController.getAllGuards).post(validateCreateGuard, guardsController.createGuard)

router.route('/:id').get(guardsController.getGuardById).put(validateUpdateGuard, guardsController.updateGuard).delete(guardsController.deleteGuard)

// Special Operations
router.route('/:id/permanent').delete(guardsController.permanentlyDeleteGuard)

// Employee ID specific route
router.route('/employee/:employeeId').get(guardsController.getGuardByEmployeeId)

// Site assignment operations
router.route('/:id/assign-site').post(guardsController.assignGuardToSite)

router.route('/:id/remove-site').post(guardsController.removeGuardFromSite)

// Utility and reporting routes
router.route('/expiring-certifications').get(guardsController.getGuardsWithExpiringCertifications)

router.route('/by-skill/:skill').get(guardsController.getGuardsBySkill)

router.route('/available').get(guardsController.getAvailableGuards)

router.route('/search').get(guardsController.searchGuards)

router.route('/statistics').get(guardsController.getGuardStatistics)

export default router
