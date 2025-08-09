import mongoose, { Schema, Document } from 'mongoose'
import { IGuard } from '../types/types'
import logger from '../util/logger'

export interface IGuardDocument extends Omit<IGuard, '_id'>, Document {
  isAvailableForAssignment(): boolean
}

const guardSchema = new Schema<IGuardDocument>(
  {
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9]{4,10}$/, 'Employee ID must be 4-10 alphanumeric characters']
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^(\+1|1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/, 'Please enter a valid phone number']
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
        maxlength: [100, 'Street address cannot exceed 100 characters']
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [50, 'City cannot exceed 50 characters']
      },
      province: {
        type: String,
        required: [true, 'Province is required'],
        trim: true,
        enum: {
          values: ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'],
          message: 'Please enter a valid Canadian province abbreviation'
        }
      },
      postalCode: {
        type: String,
        required: [true, 'Postal code is required'],
        trim: true,
        uppercase: true,
        match: [/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/, 'Please enter a valid Canadian postal code']
      },
      country: {
        type: String,
        required: true,
        default: 'Canada',
        enum: ['Canada']
      }
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, 'Emergency contact name is required'],
        trim: true,
        maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
      },
      relationship: {
        type: String,
        required: [true, 'Emergency contact relationship is required'],
        trim: true,
        maxlength: [50, 'Relationship cannot exceed 50 characters']
      },
      phone: {
        type: String,
        required: [true, 'Emergency contact phone is required'],
        trim: true,
        match: [/^(\+1|1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/, 'Please enter a valid emergency contact phone number']
      }
    },
    employmentDetails: {
      hireDate: {
        type: Date,
        required: [true, 'Hire date is required'],
        validate: {
          validator: function (value: Date) {
            return value <= new Date()
          },
          message: 'Hire date cannot be in the future'
        }
      },
      employmentType: {
        type: String,
        required: [true, 'Employment type is required'],
        enum: {
          values: ['full-time', 'part-time', 'contract'],
          message: 'Employment type must be full-time, part-time, or contract'
        }
      },
      hourlyRate: {
        type: Number,
        required: [true, 'Hourly rate is required'],
        min: [15, 'Hourly rate must be at least $15.00'],
        max: [100, 'Hourly rate cannot exceed $100.00']
      },
      status: {
        type: String,
        required: true,
        enum: {
          values: ['active', 'inactive', 'suspended', 'terminated'],
          message: 'Status must be active, inactive, suspended, or terminated'
        },
        default: 'active'
      }
    },
    certifications: {
      securityLicense: {
        number: {
          type: String,
          required: [true, 'Security license number is required'],
          trim: true,
          unique: true
        },
        issueDate: {
          type: Date,
          required: [true, 'Security license issue date is required']
        },
        expiryDate: {
          type: Date,
          required: [true, 'Security license expiry date is required'],
          validate: {
            validator: function (value: Date) {
              return value > new Date()
            },
            message: 'Security license expiry date must be in the future'
          }
        },
        issuingAuthority: {
          type: String,
          required: [true, 'Security license issuing authority is required'],
          trim: true
        }
      },
      firstAid: {
        number: {
          type: String,
          trim: true
        },
        issueDate: {
          type: Date
        },
        expiryDate: {
          type: Date,
          validate: {
            validator: function (value: Date) {
              return !value || value > new Date()
            },
            message: 'First aid certification expiry date must be in the future'
          }
        },
        issuingAuthority: {
          type: String,
          trim: true
        }
      },
      lossPreventionCertification: {
        number: {
          type: String,
          trim: true
        },
        issueDate: {
          type: Date
        },
        expiryDate: {
          type: Date,
          validate: {
            validator: function (value: Date) {
              return !value || value > new Date()
            },
            message: 'Loss prevention certification expiry date must be in the future'
          }
        },
        issuingAuthority: {
          type: String,
          trim: true
        }
      }
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function (skills: string[]) {
          return skills.every((skill) => skill.trim().length > 0)
        },
        message: 'All skills must be non-empty strings'
      }
    },
    assignedSites: {
      type: [String],
      default: [],
      ref: 'Site' // Reference to Site model (to be created later)
    },
    profileImage: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i, 'Profile image must be a valid image URL']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: function (_doc, ret) {
        ret.id = ret._id
        delete ret._id
        return ret
      }
    }
  }
)

// Compound indexes for efficient querying
guardSchema.index({ 'employmentDetails.status': 1 })
guardSchema.index({ 'employmentDetails.employmentType': 1 })
guardSchema.index({ firstName: 1, lastName: 1 })
guardSchema.index({ skills: 1 })
guardSchema.index({ assignedSites: 1 })
guardSchema.index({ 'certifications.securityLicense.expiryDate': 1 })

// Text index for search functionality
guardSchema.index({
  firstName: 'text',
  lastName: 'text',
  employeeId: 'text',
  email: 'text'
})

// Middleware to check certification expiry
guardSchema.pre('save', function (next) {
  const guard = this as IGuardDocument

  // Check if security license is expiring soon (within 30 days)
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  if (guard.certifications.securityLicense.expiryDate <= thirtyDaysFromNow) {
    logger.warn(`Security license for guard ${guard.employeeId} expires on ${guard.certifications.securityLicense.expiryDate}`)
  }

  next()
})

// Virtual for full name
guardSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

// Method to check if guard is available for assignment
guardSchema.methods.isAvailableForAssignment = function (): boolean {
  return this.employmentDetails.status === 'active' && this.certifications.securityLicense.expiryDate > new Date()
}

// Static method to find guards with expiring certifications
guardSchema.statics.findGuardsWithExpiringCertifications = function (days: number = 30) {
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + days)

  return this.find({
    $or: [
      { 'certifications.securityLicense.expiryDate': { $lte: expiryDate } },
      { 'certifications.firstAid.expiryDate': { $lte: expiryDate } },
      { 'certifications.lossPreventionCertification.expiryDate': { $lte: expiryDate } }
    ]
  })
}

const GuardModel = mongoose.model<IGuardDocument>('Guard', guardSchema)

export default GuardModel
