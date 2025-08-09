import { Request, Response, NextFunction } from 'express'
import httpError from '../util/httpError'

// Helper function to validate required fields
const validateRequired = (value: any, fieldName: string): string | null => {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`
  }
  return null
}

// Helper function to validate email format
const validateEmail = (email: string): string | null => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }
  return null
}

// Helper function to validate phone format
const validatePhone = (phone: string): string | null => {
  const phoneRegex = /^(\+1|1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number'
  }
  return null
}

// Helper function to validate Canadian postal code
const validatePostalCode = (postalCode: string): string | null => {
  const postalCodeRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/
  if (!postalCodeRegex.test(postalCode.toUpperCase())) {
    return 'Please enter a valid Canadian postal code'
  }
  return null
}

// Helper function to validate province
const validateProvince = (province: string): string | null => {
  const validProvinces = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT']
  if (!validProvinces.includes(province.toUpperCase())) {
    return 'Please enter a valid Canadian province abbreviation'
  }
  return null
}

// Helper function to validate date
const validateDate = (date: string | Date, fieldName: string, canBeFuture: boolean = true): string | null => {
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} must be a valid date`
  }

  if (!canBeFuture && dateObj > new Date()) {
    return `${fieldName} cannot be in the future`
  }

  return null
}

// Helper function to validate employment type
const validateEmploymentType = (type: string): string | null => {
  const validTypes = ['full-time', 'part-time', 'contract']
  if (!validTypes.includes(type)) {
    return 'Employment type must be full-time, part-time, or contract'
  }
  return null
}

// Helper function to validate status
const validateStatus = (status: string): string | null => {
  const validStatuses = ['active', 'inactive', 'suspended', 'terminated']
  if (!validStatuses.includes(status)) {
    return 'Status must be active, inactive, suspended, or terminated'
  }
  return null
}

// Helper function to validate hourly rate
const validateHourlyRate = (rate: number): string | null => {
  if (typeof rate !== 'number' || rate < 15 || rate > 100) {
    return 'Hourly rate must be between $15.00 and $100.00'
  }
  return null
}

// Main validation function for creating guards
export const validateCreateGuard = (req: Request, _res: Response, next: NextFunction): void => {
  const errors: string[] = []
  const { body } = req

  try {
    // Validate basic info
    let error = validateRequired(body.employeeId, 'Employee ID')
    if (error) errors.push(error)
    else if (!/^[A-Z0-9]{4,10}$/.test(body.employeeId.toUpperCase())) {
      errors.push('Employee ID must be 4-10 alphanumeric characters')
    }

    error = validateRequired(body.firstName, 'First name')
    if (error) errors.push(error)
    else if (body.firstName.trim().length < 2 || body.firstName.trim().length > 50) {
      errors.push('First name must be between 2-50 characters')
    }

    error = validateRequired(body.lastName, 'Last name')
    if (error) errors.push(error)
    else if (body.lastName.trim().length < 2 || body.lastName.trim().length > 50) {
      errors.push('Last name must be between 2-50 characters')
    }

    error = validateRequired(body.email, 'Email')
    if (error) errors.push(error)
    else {
      error = validateEmail(body.email)
      if (error) errors.push(error)
    }

    error = validateRequired(body.phone, 'Phone')
    if (error) errors.push(error)
    else {
      error = validatePhone(body.phone)
      if (error) errors.push(error)
    }

    // Validate address
    if (!body.address || typeof body.address !== 'object') {
      errors.push('Address is required')
    } else {
      error = validateRequired(body.address.street, 'Street address')
      if (error) errors.push(error)

      error = validateRequired(body.address.city, 'City')
      if (error) errors.push(error)

      error = validateRequired(body.address.province, 'Province')
      if (error) errors.push(error)
      else {
        error = validateProvince(body.address.province)
        if (error) errors.push(error)
      }

      error = validateRequired(body.address.postalCode, 'Postal code')
      if (error) errors.push(error)
      else {
        error = validatePostalCode(body.address.postalCode)
        if (error) errors.push(error)
      }
    }

    // Validate emergency contact
    if (!body.emergencyContact || typeof body.emergencyContact !== 'object') {
      errors.push('Emergency contact is required')
    } else {
      error = validateRequired(body.emergencyContact.name, 'Emergency contact name')
      if (error) errors.push(error)

      error = validateRequired(body.emergencyContact.relationship, 'Emergency contact relationship')
      if (error) errors.push(error)

      error = validateRequired(body.emergencyContact.phone, 'Emergency contact phone')
      if (error) errors.push(error)
      else {
        error = validatePhone(body.emergencyContact.phone)
        if (error) errors.push(`Emergency contact ${error.toLowerCase()}`)
      }
    }

    // Validate employment details
    if (!body.employmentDetails || typeof body.employmentDetails !== 'object') {
      errors.push('Employment details are required')
    } else {
      error = validateRequired(body.employmentDetails.hireDate, 'Hire date')
      if (error) errors.push(error)
      else {
        error = validateDate(body.employmentDetails.hireDate, 'Hire date', false)
        if (error) errors.push(error)
      }

      error = validateRequired(body.employmentDetails.employmentType, 'Employment type')
      if (error) errors.push(error)
      else {
        error = validateEmploymentType(body.employmentDetails.employmentType)
        if (error) errors.push(error)
      }

      error = validateRequired(body.employmentDetails.hourlyRate, 'Hourly rate')
      if (error) errors.push(error)
      else {
        error = validateHourlyRate(body.employmentDetails.hourlyRate)
        if (error) errors.push(error)
      }
    }

    // Validate certifications
    if (!body.certifications || typeof body.certifications !== 'object') {
      errors.push('Certifications are required')
    } else {
      if (!body.certifications.securityLicense) {
        errors.push('Security license is required')
      } else {
        error = validateRequired(body.certifications.securityLicense.number, 'Security license number')
        if (error) errors.push(error)

        error = validateRequired(body.certifications.securityLicense.issueDate, 'Security license issue date')
        if (error) errors.push(error)
        else {
          error = validateDate(body.certifications.securityLicense.issueDate, 'Security license issue date')
          if (error) errors.push(error)
        }

        error = validateRequired(body.certifications.securityLicense.expiryDate, 'Security license expiry date')
        if (error) errors.push(error)
        else {
          error = validateDate(body.certifications.securityLicense.expiryDate, 'Security license expiry date')
          if (error) errors.push(error)
          else if (new Date(body.certifications.securityLicense.expiryDate) <= new Date()) {
            errors.push('Security license expiry date must be in the future')
          }
        }

        error = validateRequired(body.certifications.securityLicense.issuingAuthority, 'Security license issuing authority')
        if (error) errors.push(error)
      }

      // Optional certifications validation
      if (body.certifications.firstAid && typeof body.certifications.firstAid === 'object') {
        if (body.certifications.firstAid.expiryDate) {
          error = validateDate(body.certifications.firstAid.expiryDate, 'First aid expiry date')
          if (error) errors.push(error)
          else if (new Date(body.certifications.firstAid.expiryDate) <= new Date()) {
            errors.push('First aid expiry date must be in the future')
          }
        }
      }

      if (body.certifications.lossPreventionCertification && typeof body.certifications.lossPreventionCertification === 'object') {
        if (body.certifications.lossPreventionCertification.expiryDate) {
          error = validateDate(body.certifications.lossPreventionCertification.expiryDate, 'Loss prevention certification expiry date')
          if (error) errors.push(error)
          else if (new Date(body.certifications.lossPreventionCertification.expiryDate) <= new Date()) {
            errors.push('Loss prevention certification expiry date must be in the future')
          }
        }
      }
    }

    // Validate skills (optional)
    if (body.skills && Array.isArray(body.skills)) {
      body.skills.forEach((skill: any, index: number) => {
        if (typeof skill !== 'string' || skill.trim().length === 0) {
          errors.push(`Skill at index ${index} must be a non-empty string`)
        }
      })
    }

    // Validate notes (optional)
    if (body.notes && typeof body.notes === 'string' && body.notes.length > 1000) {
      errors.push('Notes cannot exceed 1000 characters')
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      const errorMessage = `Validation failed: ${errors.join(', ')}`
      const error = new Error(errorMessage)
      return httpError(next, error, req, 400)
    }

    // Validation passed, proceed to controller
    next()
  } catch (error) {
    httpError(next, error, req, 500)
  }
}

// Validation function for updating guards
export const validateUpdateGuard = (req: Request, _res: Response, next: NextFunction): void => {
  const errors: string[] = []
  const { body } = req

  try {
    // For updates, fields are optional but if provided, must be valid
    if (body.employeeId !== undefined) {
      if (!/^[A-Z0-9]{4,10}$/.test(body.employeeId.toUpperCase())) {
        errors.push('Employee ID must be 4-10 alphanumeric characters')
      }
    }

    if (body.firstName !== undefined) {
      if (typeof body.firstName !== 'string' || body.firstName.trim().length < 2 || body.firstName.trim().length > 50) {
        errors.push('First name must be between 2-50 characters')
      }
    }

    if (body.lastName !== undefined) {
      if (typeof body.lastName !== 'string' || body.lastName.trim().length < 2 || body.lastName.trim().length > 50) {
        errors.push('Last name must be between 2-50 characters')
      }
    }

    if (body.email !== undefined) {
      const error = validateEmail(body.email)
      if (error) errors.push(error)
    }

    if (body.phone !== undefined) {
      const error = validatePhone(body.phone)
      if (error) errors.push(error)
    }

    // Validate address if provided
    if (body.address !== undefined) {
      if (typeof body.address !== 'object') {
        errors.push('Address must be an object')
      } else {
        if (body.address.province !== undefined) {
          const error = validateProvince(body.address.province)
          if (error) errors.push(error)
        }

        if (body.address.postalCode !== undefined) {
          const error = validatePostalCode(body.address.postalCode)
          if (error) errors.push(error)
        }
      }
    }

    // Validate employment details if provided
    if (body.employmentDetails !== undefined) {
      if (typeof body.employmentDetails !== 'object') {
        errors.push('Employment details must be an object')
      } else {
        if (body.employmentDetails.hireDate !== undefined) {
          const error = validateDate(body.employmentDetails.hireDate, 'Hire date', false)
          if (error) errors.push(error)
        }

        if (body.employmentDetails.employmentType !== undefined) {
          const error = validateEmploymentType(body.employmentDetails.employmentType)
          if (error) errors.push(error)
        }

        if (body.employmentDetails.hourlyRate !== undefined) {
          const error = validateHourlyRate(body.employmentDetails.hourlyRate)
          if (error) errors.push(error)
        }

        if (body.employmentDetails.status !== undefined) {
          const error = validateStatus(body.employmentDetails.status)
          if (error) errors.push(error)
        }
      }
    }

    // Validate skills if provided
    if (body.skills !== undefined) {
      if (!Array.isArray(body.skills)) {
        errors.push('Skills must be an array')
      } else {
        body.skills.forEach((skill: any, index: number) => {
          if (typeof skill !== 'string' || skill.trim().length === 0) {
            errors.push(`Skill at index ${index} must be a non-empty string`)
          }
        })
      }
    }

    // Validate notes if provided
    if (body.notes !== undefined && typeof body.notes === 'string' && body.notes.length > 1000) {
      errors.push('Notes cannot exceed 1000 characters')
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      const errorMessage = `Validation failed: ${errors.join(', ')}`
      const error = new Error(errorMessage)
      return httpError(next, error, req, 400)
    }

    // Validation passed, proceed to controller
    next()
  } catch (error) {
    httpError(next, error, req, 500)
  }
}

// Validation for guard query parameters
export const validateGuardQuery = (req: Request, _res: Response, next: NextFunction): void => {
  const errors: string[] = []
  const { query } = req

  try {
    // Validate status if provided
    if (query.status && typeof query.status === 'string') {
      const error = validateStatus(query.status)
      if (error) errors.push(error)
    }

    // Validate employment type if provided
    if (query.employmentType && typeof query.employmentType === 'string') {
      const error = validateEmploymentType(query.employmentType)
      if (error) errors.push(error)
    }

    // Validate page and limit
    if (query.page) {
      const page = parseInt(query.page as string)
      if (isNaN(page) || page < 1) {
        errors.push('Page must be a positive integer')
      }
    }

    if (query.limit) {
      const limit = parseInt(query.limit as string)
      if (isNaN(limit) || limit < 1 || limit > 100) {
        errors.push('Limit must be between 1 and 100')
      }
    }

    // Validate sortBy
    if (query.sortBy && typeof query.sortBy === 'string') {
      const validSortFields = ['firstName', 'lastName', 'hireDate', 'employeeId']
      if (!validSortFields.includes(query.sortBy)) {
        errors.push('SortBy must be one of: firstName, lastName, hireDate, employeeId')
      }
    }

    // Validate sortOrder
    if (query.sortOrder && typeof query.sortOrder === 'string') {
      if (!['asc', 'desc'].includes(query.sortOrder)) {
        errors.push('SortOrder must be asc or desc')
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      const errorMessage = `Query validation failed: ${errors.join(', ')}`
      const error = new Error(errorMessage)
      return httpError(next, error, req, 400)
    }

    // Validation passed, proceed to controller
    next()
  } catch (error) {
    httpError(next, error, req, 500)
  }
}
