#!/bin/bash

# Guard API Testing Script with cURL
# Make sure the server is running on localhost:3000

BASE_URL="http://localhost:3000/api/v1"

echo "🧪 Testing Guards API with cURL..."

# Test 1: Health Check
echo "1. Testing health check..."
curl -s "${BASE_URL}/self1" | jq .

# Test 2: Get all guards
echo -e "\n2. Getting all guards..."
curl -s "${BASE_URL}/guards" | jq .

# Test 3: Create a guard
echo -e "\n3. Creating a new guard..."
curl -s -X POST "${BASE_URL}/guards" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "CURL001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567",
    "address": {
      "street": "123 Test Street",
      "city": "Toronto",
      "province": "ON",
      "postalCode": "M5H 2N2",
      "country": "Canada"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "(555) 987-6543"
    },
    "employmentDetails": {
      "hireDate": "2024-01-15",
      "employmentType": "full-time",
      "hourlyRate": 25.0
    },
    "certifications": {
      "securityLicense": {
        "number": "SL999888777",
        "issueDate": "2023-12-01",
        "expiryDate": "2025-12-01",
        "issuingAuthority": "Test Authority"
      }
    },
    "skills": ["Security", "Customer Service"],
    "notes": "Created via cURL test"
  }' | jq .

# Test 4: Search guards
echo -e "\n4. Searching guards..."
curl -s "${BASE_URL}/guards?search=John&limit=5" | jq .

# Test 5: Get statistics
echo -e "\n5. Getting guard statistics..."
curl -s "${BASE_URL}/guards/statistics" | jq .

echo -e "\n🏁 cURL testing completed!"
