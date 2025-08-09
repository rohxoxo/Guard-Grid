import GuardModel, { IGuardDocument } from '../model/guardModel'
import { ICreateGuardRequest, IUpdateGuardRequest, IGuardQuery } from '../types/types'
import mongoose from 'mongoose'

export class GuardService {
  /**
   * Create a new guard
   */
  static async createGuard(guardData: ICreateGuardRequest): Promise<IGuardDocument> {
    try {
      // Set default status to active
      const newGuardData = {
        ...guardData,
        employmentDetails: {
          ...guardData.employmentDetails,
          status: 'active' as const
        }
      }

      const guard = new GuardModel(newGuardData)
      await guard.save()
      return guard
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(
          `Validation Error: ${Object.values(error.errors)
            .map((err) => err.message)
            .join(', ')}`
        )
      }
      if ((error as any).code === 11000) {
        const field = Object.keys((error as any).keyPattern)[0]
        throw new Error(`${field} already exists`)
      }
      throw error
    }
  }

  /**
   * Get all guards with filtering, pagination, and sorting
   */
  static async getAllGuards(query: IGuardQuery): Promise<{
    guards: IGuardDocument[]
    pagination: {
      currentPage: number
      totalPages: number
      totalGuards: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    const { status, employmentType, skills, assignedSite, search, page = 1, limit = 10, sortBy = 'firstName', sortOrder = 'asc' } = query

    // Build filter object
    const filter: any = {}

    if (status) {
      filter['employmentDetails.status'] = status
    }

    if (employmentType) {
      filter['employmentDetails.employmentType'] = employmentType
    }

    if (skills) {
      filter.skills = { $in: [skills] }
    }

    if (assignedSite) {
      filter.assignedSites = { $in: [assignedSite] }
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    const sortDirection = sortOrder === 'desc' ? -1 : 1
    const sortObject: any = {}

    if (sortBy === 'hireDate') {
      sortObject['employmentDetails.hireDate'] = sortDirection
    } else {
      sortObject[sortBy] = sortDirection
    }

    // Execute queries
    const [guards, totalGuards] = await Promise.all([
      GuardModel.find(filter).sort(sortObject).skip(skip).limit(limit).lean(),
      GuardModel.countDocuments(filter)
    ])

    const totalPages = Math.ceil(totalGuards / limit)

    return {
      guards: guards as IGuardDocument[],
      pagination: {
        currentPage: page,
        totalPages,
        totalGuards,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  /**
   * Get guard by ID
   */
  static async getGuardById(guardId: string): Promise<IGuardDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(guardId)) {
      throw new Error('Invalid guard ID format')
    }

    const guard = await GuardModel.findById(guardId).lean()
    return guard as IGuardDocument | null
  }

  /**
   * Get guard by employee ID
   */
  static async getGuardByEmployeeId(employeeId: string): Promise<IGuardDocument | null> {
    const guard = await GuardModel.findOne({ employeeId: employeeId.toUpperCase() }).lean()
    return guard as IGuardDocument | null
  }

  /**
   * Update guard by ID
   */
  static async updateGuard(guardId: string, updateData: IUpdateGuardRequest): Promise<IGuardDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(guardId)) {
      throw new Error('Invalid guard ID format')
    }

    try {
      const updatedGuard = await GuardModel.findByIdAndUpdate(
        guardId,
        { $set: updateData },
        {
          new: true,
          runValidators: true
        }
      ).lean()

      return updatedGuard as IGuardDocument | null
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new Error(
          `Validation Error: ${Object.values(error.errors)
            .map((err) => err.message)
            .join(', ')}`
        )
      }
      if ((error as any).code === 11000) {
        const field = Object.keys((error as any).keyPattern)[0]
        throw new Error(`${field} already exists`)
      }
      throw error
    }
  }

  /**
   * Delete guard by ID (soft delete by setting status to terminated)
   */
  static async deleteGuard(guardId: string): Promise<IGuardDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(guardId)) {
      throw new Error('Invalid guard ID format')
    }

    const updatedGuard = await GuardModel.findByIdAndUpdate(
      guardId,
      {
        $set: {
          'employmentDetails.status': 'terminated',
          assignedSites: [] // Remove from all sites when terminated
        }
      },
      { new: true }
    ).lean()

    return updatedGuard as IGuardDocument | null
  }

  /**
   * Permanently delete guard (use with caution)
   */
  static async permanentlyDeleteGuard(guardId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(guardId)) {
      throw new Error('Invalid guard ID format')
    }

    const result = await GuardModel.findByIdAndDelete(guardId)
    return !!result
  }

  /**
   * Assign guard to site
   */
  static async assignGuardToSite(guardId: string, siteId: string): Promise<IGuardDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(guardId)) {
      throw new Error('Invalid guard ID format')
    }

    const guard = await GuardModel.findById(guardId)
    if (!guard) {
      throw new Error('Guard not found')
    }

    if (guard.employmentDetails.status !== 'active') {
      throw new Error('Cannot assign inactive guard to site')
    }

    if (!guard.isAvailableForAssignment()) {
      throw new Error('Guard is not available for assignment')
    }

    // Check if already assigned
    if (guard.assignedSites.includes(siteId)) {
      throw new Error('Guard is already assigned to this site')
    }

    guard.assignedSites.push(siteId)
    await guard.save()

    return guard
  }

  /**
   * Remove guard from site
   */
  static async removeGuardFromSite(guardId: string, siteId: string): Promise<IGuardDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(guardId)) {
      throw new Error('Invalid guard ID format')
    }

    const guard = await GuardModel.findByIdAndUpdate(guardId, { $pull: { assignedSites: siteId } }, { new: true })

    return guard
  }

  /**
   * Get guards with expiring certifications
   */
  static async getGuardsWithExpiringCertifications(days: number = 30): Promise<IGuardDocument[]> {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + days)

    const guards = await GuardModel.find({
      'employmentDetails.status': 'active',
      $or: [
        { 'certifications.securityLicense.expiryDate': { $lte: expiryDate } },
        { 'certifications.firstAid.expiryDate': { $lte: expiryDate } },
        { 'certifications.lossPreventionCertification.expiryDate': { $lte: expiryDate } }
      ]
    }).lean()

    return guards as IGuardDocument[]
  }

  /**
   * Get guards by skill
   */
  static async getGuardsBySkill(skill: string): Promise<IGuardDocument[]> {
    const guards = await GuardModel.find({
      skills: { $in: [skill] },
      'employmentDetails.status': 'active'
    }).lean()

    return guards as IGuardDocument[]
  }

  /**
   * Get available guards (active and not assigned to maximum sites)
   */
  static async getAvailableGuards(): Promise<IGuardDocument[]> {
    const guards = await GuardModel.find({
      'employmentDetails.status': 'active',
      'certifications.securityLicense.expiryDate': { $gt: new Date() }
    }).lean()

    return guards as IGuardDocument[]
  }

  /**
   * Search guards by text
   */
  static async searchGuards(searchTerm: string, limit: number = 10): Promise<IGuardDocument[]> {
    const guards = await GuardModel.find({ $text: { $search: searchTerm } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .lean()

    return guards as IGuardDocument[]
  }

  /**
   * Get guard statistics
   */
  static async getGuardStatistics(): Promise<{
    total: number
    active: number
    inactive: number
    suspended: number
    terminated: number
    byEmploymentType: {
      fullTime: number
      partTime: number
      contract: number
    }
    expiringCertifications: number
  }> {
    const [total, active, inactive, suspended, terminated, fullTime, partTime, contract, expiringCertifications] = await Promise.all([
      GuardModel.countDocuments(),
      GuardModel.countDocuments({ 'employmentDetails.status': 'active' }),
      GuardModel.countDocuments({ 'employmentDetails.status': 'inactive' }),
      GuardModel.countDocuments({ 'employmentDetails.status': 'suspended' }),
      GuardModel.countDocuments({ 'employmentDetails.status': 'terminated' }),
      GuardModel.countDocuments({ 'employmentDetails.employmentType': 'full-time' }),
      GuardModel.countDocuments({ 'employmentDetails.employmentType': 'part-time' }),
      GuardModel.countDocuments({ 'employmentDetails.employmentType': 'contract' }),
      GuardModel.countDocuments({
        'employmentDetails.status': 'active',
        'certifications.securityLicense.expiryDate': {
          $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      })
    ])

    return {
      total,
      active,
      inactive,
      suspended,
      terminated,
      byEmploymentType: {
        fullTime,
        partTime,
        contract
      },
      expiringCertifications
    }
  }
}
