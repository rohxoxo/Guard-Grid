// Simple test script for Guards API
// This script tests the Guards API endpoints without requiring external dependencies
const logger = console

const testGuardData = {
  employeeId: 'TEST001',
  firstName: 'Test',
  lastName: 'Guard',
  email: 'test.guard@example.com',
  phone: '(555) 123-4567',
  address: {
    street: '123 Test Street',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5H 2N2',
    country: 'Canada'
  },
  emergencyContact: {
    name: 'Emergency Contact',
    relationship: 'Family',
    phone: '(555) 987-6543'
  },
  employmentDetails: {
    hireDate: new Date('2024-01-15'),
    employmentType: 'full-time',
    hourlyRate: 22.5
  },
  certifications: {
    securityLicense: {
      number: 'SL123456789',
      issueDate: new Date('2023-12-01'),
      expiryDate: new Date('2025-12-01'),
      issuingAuthority: 'Test Authority'
    }
  },
  skills: ['Test Skill', 'Security'],
  notes: 'Test guard for API testing'
}

async function testAPI() {
  const baseURL = 'http://localhost:3000/api/v1'

  logger.log('🧪 Testing Guards API...\n')

  try {
    // Test 1: Health check
    logger.log('1. Testing health check endpoint...')
    const healthResponse = await fetch(`${baseURL}/self1`)
    if (healthResponse.ok) {
      logger.log('✅ Health check passed')
    } else {
      logger.log('❌ Health check failed')
      return
    }

    // Test 2: Get all guards (should be empty initially)
    logger.log('\n2. Testing get all guards...')
    const getAllResponse = await fetch(`${baseURL}/guards`)
    if (getAllResponse.ok) {
      const data = await getAllResponse.json()
      logger.log('✅ Get all guards successful')
      logger.log(`   Found ${data.data.pagination.totalGuards} guards`)
    } else {
      logger.log('❌ Get all guards failed')
    }

    // Test 3: Create a new guard
    logger.log('\n3. Testing create guard...')
    const createResponse = await fetch(`${baseURL}/guards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testGuardData)
    })

    if (createResponse.ok) {
      const createData = await createResponse.json()
      logger.log('✅ Create guard successful')
      logger.log(`   Created guard: ${createData.data.guard.firstName} ${createData.data.guard.lastName}`)

      const guardId = createData.data.guard.id

      // Test 4: Get guard by ID
      logger.log('\n4. Testing get guard by ID...')
      const getByIdResponse = await fetch(`${baseURL}/guards/${guardId}`)
      if (getByIdResponse.ok) {
        logger.log('✅ Get guard by ID successful')
      } else {
        logger.log('❌ Get guard by ID failed')
      }

      // Test 5: Get guard by employee ID
      logger.log('\n5. Testing get guard by employee ID...')
      const getByEmployeeIdResponse = await fetch(`${baseURL}/guards/employee/${testGuardData.employeeId}`)
      if (getByEmployeeIdResponse.ok) {
        logger.log('✅ Get guard by employee ID successful')
      } else {
        logger.log('❌ Get guard by employee ID failed')
      }

      // Test 6: Update guard
      logger.log('\n6. Testing update guard...')
      const updateResponse = await fetch(`${baseURL}/guards/${guardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notes: 'Updated test guard notes',
          skills: ['Updated Skill', 'Security', 'Customer Service']
        })
      })

      if (updateResponse.ok) {
        logger.log('✅ Update guard successful')
      } else {
        logger.log('❌ Update guard failed')
      }

      // Test 7: Get available guards
      logger.log('\n7. Testing get available guards...')
      const availableResponse = await fetch(`${baseURL}/guards/available`)
      if (availableResponse.ok) {
        const availableData = await availableResponse.json()
        logger.log('✅ Get available guards successful')
        logger.log(`   Available guards: ${availableData.data.count}`)
      } else {
        logger.log('❌ Get available guards failed')
      }

      // Test 8: Search guards
      logger.log('\n8. Testing search guards...')
      const searchResponse = await fetch(`${baseURL}/guards/search?q=Test&limit=5`)
      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        logger.log('✅ Search guards successful')
        logger.log(`   Search results: ${searchData.data.count}`)
      } else {
        logger.log('❌ Search guards failed')
      }

      // Test 9: Get statistics
      logger.log('\n9. Testing get guard statistics...')
      const statsResponse = await fetch(`${baseURL}/guards/statistics`)
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        logger.log('✅ Get statistics successful')
        logger.log(`   Total guards: ${statsData.data.statistics.total}`)
        logger.log(`   Active guards: ${statsData.data.statistics.active}`)
      } else {
        logger.log('❌ Get statistics failed')
      }

      // Test 10: Delete guard (soft delete)
      logger.log('\n10. Testing delete guard (terminate)...')
      const deleteResponse = await fetch(`${baseURL}/guards/${guardId}`, {
        method: 'DELETE'
      })

      if (deleteResponse.ok) {
        logger.log('✅ Delete guard (terminate) successful')
      } else {
        logger.log('❌ Delete guard (terminate) failed')
      }
    } else {
      const errorData = await createResponse.json()
      logger.log('❌ Create guard failed')
      logger.log(`   Error: ${errorData.message}`)
    }
  } catch (error) {
    logger.error('❌ API test failed with error:', error.message)
    logger.log('\n💡 Make sure the server is running and MongoDB is connected')
    logger.log('   Run: npm run dev')
    logger.log('   And ensure MongoDB is running on localhost:27017')
  }

  logger.log('\n🏁 Testing completed!')
}

// Only run if this file is executed directly (not imported)
if (typeof window === 'undefined' && require.main === module) {
  testAPI()
}

module.exports = { testAPI, testGuardData }
