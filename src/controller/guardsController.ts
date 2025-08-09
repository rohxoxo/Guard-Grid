import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constant/responseMessage'
import httpError from '../util/httpError'
import { GuardService } from '../services/guardService'
import { ICreateGuardRequest, IUpdateGuardRequest, IGuardQuery } from '../types/types'

export default {
  /**
   * Create a new guard
   * POST /api/v1/guards
   */
  createGuard: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guardData: ICreateGuardRequest = req.body

      const newGuard = await GuardService.createGuard(guardData)

      httpResponse(req, res, 201, 'Guard created successfully', {
        guard: newGuard
      })
    } catch (error) {
      httpError(next, error, req, 400)
    }
  },

  /**
   * Get all guards with filtering, pagination, and sorting
   * GET /api/v1/guards
   */
  getAllGuards: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: IGuardQuery = {
        status: req.query.status as any,
        employmentType: req.query.employmentType as any,
        skills: req.query.skills as string,
        assignedSite: req.query.assignedSite as string,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sortBy: (req.query.sortBy as any) || 'firstName',
        sortOrder: (req.query.sortOrder as any) || 'asc'
      }

      const result = await GuardService.getAllGuards(query)

      httpResponse(req, res, 200, 'Guards retrieved successfully', {
        guards: result.guards,
        pagination: result.pagination
      })
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },

  /**
   * Get guard by ID
   * GET /api/v1/guards/:id
   */
  getGuardById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params

      const guard = await GuardService.getGuardById(id)

      if (!guard) {
        const errorMessage = responseMessage.NOT_FOUND('Guard')
        const error = new Error(errorMessage)
        return httpError(next, error, req, 404)
      }

      httpResponse(req, res, 200, 'Guard retrieved successfully', {
        guard
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid guard ID format')) {
        httpError(next, error, req, 400)
      } else {
        httpError(next, error, req, 500)
      }
    }
  },

  /**
   * Get guard by employee ID
   * GET /api/v1/guards/employee/:employeeId
   */
  getGuardByEmployeeId: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { employeeId } = req.params

      const guard = await GuardService.getGuardByEmployeeId(employeeId)

      if (!guard) {
        const errorMessage = responseMessage.NOT_FOUND('Guard')
        const error = new Error(errorMessage)
        return httpError(next, error, req, 404)
      }

      httpResponse(req, res, 200, 'Guard retrieved successfully', {
        guard
      })
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },

  /**
   * Update guard by ID
   * PUT /api/v1/guards/:id
   */
  updateGuard: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const updateData: IUpdateGuardRequest = req.body

      const updatedGuard = await GuardService.updateGuard(id, updateData)

      if (!updatedGuard) {
        const errorMessage = responseMessage.NOT_FOUND('Guard')
        const error = new Error(errorMessage)
        return httpError(next, error, req, 404)
      }

      httpResponse(req, res, 200, 'Guard updated successfully', {
        guard: updatedGuard
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid guard ID format')) {
        httpError(next, error, req, 400)
      } else if (error instanceof Error && error.message.includes('Validation Error')) {
        httpError(next, error, req, 400)
      } else if (error instanceof Error && error.message.includes('already exists')) {
        httpError(next, error, req, 409)
      } else {
        httpError(next, error, req, 500)
      }
    }
  },

  /**
   * Delete guard by ID (soft delete)
   * DELETE /api/v1/guards/:id
   */
  deleteGuard: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params

      const deletedGuard = await GuardService.deleteGuard(id)

      if (!deletedGuard) {
        const errorMessage = responseMessage.NOT_FOUND('Guard')
        const error = new Error(errorMessage)
        return httpError(next, error, req, 404)
      }

      httpResponse(req, res, 200, 'Guard terminated successfully', {
        guard: deletedGuard
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid guard ID format')) {
        httpError(next, error, req, 400)
      } else {
        httpError(next, error, req, 500)
      }
    }
  },

  /**
   * Permanently delete guard by ID
   * DELETE /api/v1/guards/:id/permanent
   */
  permanentlyDeleteGuard: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params

      const isDeleted = await GuardService.permanentlyDeleteGuard(id)

      if (!isDeleted) {
        const errorMessage = responseMessage.NOT_FOUND('Guard')
        const error = new Error(errorMessage)
        return httpError(next, error, req, 404)
      }

      httpResponse(req, res, 200, 'Guard permanently deleted successfully', null)
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid guard ID format')) {
        httpError(next, error, req, 400)
      } else {
        httpError(next, error, req, 500)
      }
    }
  },

  /**
   * Assign guard to site
   * POST /api/v1/guards/:id/assign-site
   */
  assignGuardToSite: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const { siteId } = req.body

      if (!siteId) {
        const error = new Error('Site ID is required')
        return httpError(next, error, req, 400)
      }

      const updatedGuard = await GuardService.assignGuardToSite(id, siteId)

      httpResponse(req, res, 200, 'Guard assigned to site successfully', {
        guard: updatedGuard
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid guard ID format')) {
        httpError(next, error, req, 400)
      } else if (
        error instanceof Error &&
        (error.message.includes('Guard not found') ||
          error.message.includes('Cannot assign inactive guard') ||
          error.message.includes('not available for assignment') ||
          error.message.includes('already assigned'))
      ) {
        httpError(next, error, req, 400)
      } else {
        httpError(next, error, req, 500)
      }
    }
  },

  /**
   * Remove guard from site
   * POST /api/v1/guards/:id/remove-site
   */
  removeGuardFromSite: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params
      const { siteId } = req.body

      if (!siteId) {
        const error = new Error('Site ID is required')
        return httpError(next, error, req, 400)
      }

      const updatedGuard = await GuardService.removeGuardFromSite(id, siteId)

      if (!updatedGuard) {
        const errorMessage = responseMessage.NOT_FOUND('Guard')
        const error = new Error(errorMessage)
        return httpError(next, error, req, 404)
      }

      httpResponse(req, res, 200, 'Guard removed from site successfully', {
        guard: updatedGuard
      })
    } catch (error) {
      if (error instanceof Error && error.message.includes('Invalid guard ID format')) {
        httpError(next, error, req, 400)
      } else {
        httpError(next, error, req, 500)
      }
    }
  },

  /**
   * Get guards with expiring certifications
   * GET /api/v1/guards/expiring-certifications
   */
  getGuardsWithExpiringCertifications: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30

      if (isNaN(days) || days < 1 || days > 365) {
        const error = new Error('Days parameter must be between 1 and 365')
        return httpError(next, error, req, 400)
      }

      const guards = await GuardService.getGuardsWithExpiringCertifications(days)

      httpResponse(req, res, 200, `Guards with certifications expiring in ${days} days retrieved successfully`, {
        guards,
        expiringIn: days,
        count: guards.length
      })
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },

  /**
   * Get guards by skill
   * GET /api/v1/guards/by-skill/:skill
   */
  getGuardsBySkill: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { skill } = req.params

      if (!skill || skill.trim().length === 0) {
        const error = new Error('Skill parameter is required')
        return httpError(next, error, req, 400)
      }

      const guards = await GuardService.getGuardsBySkill(skill)

      httpResponse(req, res, 200, `Guards with skill '${skill}' retrieved successfully`, {
        guards,
        skill,
        count: guards.length
      })
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },

  /**
   * Get available guards
   * GET /api/v1/guards/available
   */
  getAvailableGuards: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guards = await GuardService.getAvailableGuards()

      httpResponse(req, res, 200, 'Available guards retrieved successfully', {
        guards,
        count: guards.length
      })
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },

  /**
   * Search guards by text
   * GET /api/v1/guards/search
   */
  searchGuards: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { q: searchTerm, limit } = req.query

      if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length === 0) {
        const error = new Error('Search term (q) is required')
        return httpError(next, error, req, 400)
      }

      const searchLimit = limit ? parseInt(limit as string) : 10
      if (isNaN(searchLimit) || searchLimit < 1 || searchLimit > 50) {
        const error = new Error('Limit must be between 1 and 50')
        return httpError(next, error, req, 400)
      }

      const guards = await GuardService.searchGuards(searchTerm, searchLimit)

      httpResponse(req, res, 200, `Search results for '${searchTerm}' retrieved successfully`, {
        guards,
        searchTerm,
        count: guards.length
      })
    } catch (error) {
      httpError(next, error, req, 500)
    }
  },

  /**
   * Get guard statistics
   * GET /api/v1/guards/statistics
   */
  getGuardStatistics: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const statistics = await GuardService.getGuardStatistics()

      httpResponse(req, res, 200, 'Guard statistics retrieved successfully', {
        statistics
      })
    } catch (error) {
      httpError(next, error, req, 500)
    }
  }
}
