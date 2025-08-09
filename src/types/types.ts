export type THttpResponse = {
  success: boolean
  statusCode: number
  request: {
    ip?: string | null
    meathod: string
    url: string
  }
  message: string
  data: unknown
}

export type THttpError = {
  success: boolean
  statusCode: number
  request: {
    ip?: string | null
    meathod: string
    url: string
  }
  message: string
  data: unknown
  trace?: object | null
}

// Guards Related Types
export interface IGuard {
  _id?: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  employmentDetails: {
    hireDate: Date
    employmentType: 'full-time' | 'part-time' | 'contract'
    hourlyRate: number
    status: 'active' | 'inactive' | 'suspended' | 'terminated'
  }
  certifications: {
    securityLicense: {
      number: string
      issueDate: Date
      expiryDate: Date
      issuingAuthority: string
    }
    firstAid?: {
      number: string
      issueDate: Date
      expiryDate: Date
      issuingAuthority: string
    }
    lossPreventionCertification?: {
      number: string
      issueDate: Date
      expiryDate: Date
      issuingAuthority: string
    }
  }
  skills: string[]
  assignedSites: string[] // Array of site IDs
  profileImage?: string
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ICreateGuardRequest {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  employmentDetails: {
    hireDate: Date
    employmentType: 'full-time' | 'part-time' | 'contract'
    hourlyRate: number
  }
  certifications: {
    securityLicense: {
      number: string
      issueDate: Date
      expiryDate: Date
      issuingAuthority: string
    }
    firstAid?: {
      number: string
      issueDate: Date
      expiryDate: Date
      issuingAuthority: string
    }
    lossPreventionCertification?: {
      number: string
      issueDate: Date
      expiryDate: Date
      issuingAuthority: string
    }
  }
  skills?: string[]
  notes?: string
}

export interface IUpdateGuardRequest {
  employeeId?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    province?: string
    postalCode?: string
    country?: string
  }
  emergencyContact?: {
    name?: string
    relationship?: string
    phone?: string
  }
  employmentDetails?: {
    hireDate?: Date
    employmentType?: 'full-time' | 'part-time' | 'contract'
    hourlyRate?: number
    status?: 'active' | 'inactive' | 'suspended' | 'terminated'
  }
  certifications?: {
    securityLicense?: {
      number?: string
      issueDate?: Date
      expiryDate?: Date
      issuingAuthority?: string
    }
    firstAid?: {
      number?: string
      issueDate?: Date
      expiryDate?: Date
      issuingAuthority?: string
    }
    lossPreventionCertification?: {
      number?: string
      issueDate?: Date
      expiryDate?: Date
      issuingAuthority?: string
    }
  }
  skills?: string[]
  assignedSites?: string[]
  profileImage?: string
  notes?: string
}

export interface IGuardQuery {
  status?: 'active' | 'inactive' | 'suspended' | 'terminated'
  employmentType?: 'full-time' | 'part-time' | 'contract'
  skills?: string
  assignedSite?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: 'firstName' | 'lastName' | 'hireDate' | 'employeeId'
  sortOrder?: 'asc' | 'desc'
}
