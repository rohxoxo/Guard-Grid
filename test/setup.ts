import mongoose from 'mongoose'

// Setup for Jest tests
beforeAll(async () => {
  // Connect to test database
  const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/guard-grid-test'
  await mongoose.connect(mongoUri)
})

afterEach(async () => {
  // Clean up test data after each test
  const collections = mongoose.connection.collections
  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  // Close database connection
  await mongoose.connection.close()
})
