import request from 'supertest'
import express from 'express'
import { GuardService } from '../src/services/guardService'

// Mock express app for testing
const app = express()
app.use(express.json())

// Import your routes
import guardsRouter from '../src/router/guardsRouter'
app.use('/api/v1/guards', guardsRouter)

describe('Guards API', () => {
  const testGuardData = {
    employeeId: 'TEST001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Test St',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M5H 2N2',
      country: 'Canada'
    },
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '(555) 987-6543'
    },
    employmentDetails: {
      hireDate: new Date('2024-01-15'),
      employmentType: 'full-time' as const,
      hourlyRate: 25.0
    },
    certifications: {
      securityLicense: {
        number: 'SL123456789',
        issueDate: new Date('2023-12-01'),
        expiryDate: new Date('2025-12-01'),
        issuingAuthority: 'Test Authority'
      }
    },
    skills: ['Security', 'Customer Service'],
    notes: 'Test guard'
  }

  describe('POST /api/v1/guards', () => {
    it('should create a new guard', async () => {
      const response = await request(app).post('/api/v1/guards').send(testGuardData).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.guard.firstName).toBe('John')
      expect(response.body.data.guard.employeeId).toBe('TEST001')
      expect(response.body.data.guard.employmentDetails.status).toBe('active')
    })

    it('should fail with invalid data', async () => {
      const invalidData = { ...testGuardData }
      delete (invalidData as any).firstName

      const response = await request(app).post('/api/v1/guards').send(invalidData).expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('First name is required')
    })

    it('should fail with duplicate employee ID', async () => {
      // Create first guard
      await request(app).post('/api/v1/guards').send(testGuardData)

      // Try to create second guard with same employee ID
      const duplicateData = { ...testGuardData, email: 'different@test.com' }
      const response = await request(app).post('/api/v1/guards').send(duplicateData).expect(409)

      expect(response.body.success).toBe(false)
      expect(response.body.message).toContain('already exists')
    })
  })

  describe('GET /api/v1/guards', () => {
    beforeEach(async () => {
      // Create test guards
      await GuardService.createGuard(testGuardData)
      await GuardService.createGuard({
        ...testGuardData,
        employeeId: 'TEST002',
        email: 'test2@test.com',
        firstName: 'Jane'
      })
    })

    it('should get all guards with pagination', async () => {
      const response = await request(app).get('/api/v1/guards').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.guards).toHaveLength(2)
      expect(response.body.data.pagination.totalGuards).toBe(2)
    })

    it('should filter guards by status', async () => {
      const response = await request(app).get('/api/v1/guards?status=active').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.guards).toHaveLength(2)
    })

    it('should search guards', async () => {
      const response = await request(app).get('/api/v1/guards?search=Jane').expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.guards).toHaveLength(1)
      expect(response.body.data.guards[0].firstName).toBe('Jane')
    })
  })

  describe('Guard Service Unit Tests', () => {
    it('should check if guard is available for assignment', async () => {
      const guard = await GuardService.createGuard(testGuardData)
      expect(guard.isAvailableForAssignment()).toBe(true)
    })

    it('should not be available if security license expired', async () => {
      const expiredData = {
        ...testGuardData,
        employeeId: 'EXPIRED001',
        email: 'expired@test.com',
        certifications: {
          securityLicense: {
            number: 'SL987654321',
            issueDate: new Date('2022-01-01'),
            expiryDate: new Date('2023-01-01'), // Expired
            issuingAuthority: 'Test Authority'
          }
        }
      }

      const guard = await GuardService.createGuard(expiredData)
      expect(guard.isAvailableForAssignment()).toBe(false)
    })

    it('should get guard statistics', async () => {
      await GuardService.createGuard(testGuardData)
      await GuardService.createGuard({
        ...testGuardData,
        employeeId: 'TEST003',
        email: 'test3@test.com',
        employmentDetails: {
          ...testGuardData.employmentDetails,
          employmentType: 'part-time'
        }
      })

      const stats = await GuardService.getGuardStatistics()
      expect(stats.total).toBe(2)
      expect(stats.active).toBe(2)
      expect(stats.byEmploymentType.fullTime).toBe(1)
      expect(stats.byEmploymentType.partTime).toBe(1)
    })
  })
})
