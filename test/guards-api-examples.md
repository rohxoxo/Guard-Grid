# Guards API Documentation and Examples

## Overview

The Guards API provides comprehensive management of security guards in the Guard-Grid system. This includes CRUD operations, site assignments, certification tracking, and advanced querying capabilities.

## Base URL

All endpoints are prefixed with: `/api/v1/guards`

## Authentication

_Note: Authentication middleware will be implemented in future updates_

---

## API Endpoints

### 1. Create a New Guard

**POST** `/api/v1/guards`

Creates a new guard in the system with comprehensive validation.

**Request Body:**

```json
{
  "employeeId": "GRD001",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com",
  "phone": "(555) 123-4567",
  "address": {
    "street": "123 Main Street",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "M5H 2N2",
    "country": "Canada"
  },
  "emergencyContact": {
    "name": "Jane Smith",
    "relationship": "Spouse",
    "phone": "(555) 987-6543"
  },
  "employmentDetails": {
    "hireDate": "2024-01-15T00:00:00.000Z",
    "employmentType": "full-time",
    "hourlyRate": 22.5
  },
  "certifications": {
    "securityLicense": {
      "number": "SL123456789",
      "issueDate": "2023-12-01T00:00:00.000Z",
      "expiryDate": "2025-12-01T00:00:00.000Z",
      "issuingAuthority": "Ontario Ministry of Community Safety"
    },
    "firstAid": {
      "number": "FA987654321",
      "issueDate": "2023-11-15T00:00:00.000Z",
      "expiryDate": "2025-11-15T00:00:00.000Z",
      "issuingAuthority": "Canadian Red Cross"
    },
    "lossPreventionCertification": {
      "number": "LP456789123",
      "issueDate": "2023-10-01T00:00:00.000Z",
      "expiryDate": "2025-10-01T00:00:00.000Z",
      "issuingAuthority": "Loss Prevention Foundation"
    }
  },
  "skills": ["Loss Prevention", "Customer Service", "Emergency Response", "Report Writing"],
  "notes": "Experienced guard with excellent customer service skills. Previously worked at Sobeys locations."
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "statusCode": 201,
  "request": {
    "method": "POST",
    "url": "/api/v1/guards"
  },
  "message": "Guard created successfully",
  "data": {
    "guard": {
      "id": "507f1f77bcf86cd799439011",
      "employeeId": "GRD001",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@example.com",
      "phone": "(555) 123-4567",
      "address": {
        "street": "123 Main Street",
        "city": "Toronto",
        "province": "ON",
        "postalCode": "M5H 2N2",
        "country": "Canada"
      },
      "emergencyContact": {
        "name": "Jane Smith",
        "relationship": "Spouse",
        "phone": "(555) 987-6543"
      },
      "employmentDetails": {
        "hireDate": "2024-01-15T00:00:00.000Z",
        "employmentType": "full-time",
        "hourlyRate": 22.5,
        "status": "active"
      },
      "certifications": {
        "securityLicense": {
          "number": "SL123456789",
          "issueDate": "2023-12-01T00:00:00.000Z",
          "expiryDate": "2025-12-01T00:00:00.000Z",
          "issuingAuthority": "Ontario Ministry of Community Safety"
        },
        "firstAid": {
          "number": "FA987654321",
          "issueDate": "2023-11-15T00:00:00.000Z",
          "expiryDate": "2025-11-15T00:00:00.000Z",
          "issuingAuthority": "Canadian Red Cross"
        },
        "lossPreventionCertification": {
          "number": "LP456789123",
          "issueDate": "2023-10-01T00:00:00.000Z",
          "expiryDate": "2025-10-01T00:00:00.000Z",
          "issuingAuthority": "Loss Prevention Foundation"
        }
      },
      "skills": ["Loss Prevention", "Customer Service", "Emergency Response", "Report Writing"],
      "assignedSites": [],
      "notes": "Experienced guard with excellent customer service skills. Previously worked at Sobeys locations.",
      "createdAt": "2024-01-20T10:30:00.000Z",
      "updatedAt": "2024-01-20T10:30:00.000Z"
    }
  }
}
```

### 2. Get All Guards

**GET** `/api/v1/guards`

Retrieves all guards with filtering, pagination, and sorting capabilities.

**Query Parameters:**

- `status` - Filter by employment status: `active`, `inactive`, `suspended`, `terminated`
- `employmentType` - Filter by employment type: `full-time`, `part-time`, `contract`
- `skills` - Filter by specific skill
- `assignedSite` - Filter by assigned site ID
- `search` - Search in name, employee ID, or email
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 10, max: 100)
- `sortBy` - Sort field: `firstName`, `lastName`, `hireDate`, `employeeId`
- `sortOrder` - Sort direction: `asc`, `desc`

**Example Request:**

```
GET /api/v1/guards?status=active&employmentType=full-time&page=1&limit=5&sortBy=firstName&sortOrder=asc
```

**Response (200 OK):**

```json
{
  "success": true,
  "statusCode": 200,
  "request": {
    "method": "GET",
    "url": "/api/v1/guards?status=active&employmentType=full-time&page=1&limit=5"
  },
  "message": "Guards retrieved successfully",
  "data": {
    "guards": [
      {
        "id": "507f1f77bcf86cd799439011",
        "employeeId": "GRD001",
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@example.com",
        "employmentDetails": {
          "status": "active",
          "employmentType": "full-time",
          "hourlyRate": 22.5
        },
        "skills": ["Loss Prevention", "Customer Service"],
        "assignedSites": ["site123", "site456"]
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalGuards": 15,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 3. Get Guard by ID

**GET** `/api/v1/guards/:id`

Retrieves a specific guard by their database ID.

**Example Request:**

```
GET /api/v1/guards/507f1f77bcf86cd799439011
```

### 4. Get Guard by Employee ID

**GET** `/api/v1/guards/employee/:employeeId`

Retrieves a specific guard by their employee ID.

**Example Request:**

```
GET /api/v1/guards/employee/GRD001
```

### 5. Update Guard

**PUT** `/api/v1/guards/:id`

Updates guard information. All fields are optional in the request body.

**Request Body Example:**

```json
{
  "employmentDetails": {
    "hourlyRate": 25.0,
    "status": "active"
  },
  "skills": ["Loss Prevention", "Customer Service", "Emergency Response", "Report Writing", "Crowd Control"],
  "notes": "Updated: Completed additional crowd control training."
}
```

### 6. Terminate Guard (Soft Delete)

**DELETE** `/api/v1/guards/:id`

Terminates a guard (sets status to 'terminated' and removes from all site assignments).

### 7. Permanently Delete Guard

**DELETE** `/api/v1/guards/:id/permanent`

Permanently removes a guard from the database. Use with extreme caution.

### 8. Assign Guard to Site

**POST** `/api/v1/guards/:id/assign-site`

Assigns a guard to a specific site.

**Request Body:**

```json
{
  "siteId": "site123"
}
```

### 9. Remove Guard from Site

**POST** `/api/v1/guards/:id/remove-site`

Removes a guard from a specific site assignment.

**Request Body:**

```json
{
  "siteId": "site123"
}
```

### 10. Get Guards with Expiring Certifications

**GET** `/api/v1/guards/expiring-certifications?days=30`

Retrieves guards whose certifications expire within the specified number of days.

### 11. Get Guards by Skill

**GET** `/api/v1/guards/by-skill/:skill`

Retrieves all active guards who have a specific skill.

**Example:**

```
GET /api/v1/guards/by-skill/Loss%20Prevention
```

### 12. Get Available Guards

**GET** `/api/v1/guards/available`

Retrieves all guards who are active and have valid certifications.

### 13. Search Guards

**GET** `/api/v1/guards/search?q=john&limit=10`

Performs text search across guard names, employee IDs, and emails.

### 14. Get Guard Statistics

**GET** `/api/v1/guards/statistics`

Retrieves comprehensive statistics about the guard workforce.

**Response Example:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Guard statistics retrieved successfully",
  "data": {
    "statistics": {
      "total": 45,
      "active": 38,
      "inactive": 3,
      "suspended": 2,
      "terminated": 2,
      "byEmploymentType": {
        "fullTime": 25,
        "partTime": 15,
        "contract": 5
      },
      "expiringCertifications": 3
    }
  }
}
```

---

## Error Handling

All endpoints return standardized error responses:

**400 Bad Request:**

```json
{
  "success": false,
  "statusCode": 400,
  "request": {
    "method": "POST",
    "url": "/api/v1/guards"
  },
  "message": "Validation failed: First name is required, Email is required",
  "data": null
}
```

**404 Not Found:**

```json
{
  "success": false,
  "statusCode": 404,
  "request": {
    "method": "GET",
    "url": "/api/v1/guards/invalid-id"
  },
  "message": "Guard not found",
  "data": null
}
```

**409 Conflict:**

```json
{
  "success": false,
  "statusCode": 409,
  "request": {
    "method": "POST",
    "url": "/api/v1/guards"
  },
  "message": "employeeId already exists",
  "data": null
}
```

---

## Validation Rules

### Required Fields for Creation:

- Employee ID (4-10 alphanumeric characters)
- First name (2-50 characters)
- Last name (2-50 characters)
- Email (valid email format)
- Phone (valid North American phone format)
- Complete address with valid Canadian postal code
- Emergency contact information
- Employment details (hire date, type, hourly rate)
- Security license certification (required)

### Optional Fields:

- First aid certification
- Loss prevention certification
- Skills array
- Profile image URL
- Notes (max 1000 characters)

### Business Rules:

- Hourly rate must be between $15.00 and $100.00
- Hire date cannot be in the future
- Certification expiry dates must be in the future
- Employee ID must be unique
- Email must be unique
- Security license number must be unique
- Only active guards with valid certifications can be assigned to sites

---

## Security Features

### Data Protection:

- Input validation and sanitization
- SQL injection prevention through Mongoose ODM
- XSS protection through input encoding
- Rate limiting (to be implemented)
- Authentication and authorization (to be implemented)

### Audit Trail:

- All guard records include creation and update timestamps
- Comprehensive logging of all operations
- Error tracking and monitoring

---

## Integration with Other Modules

The Guards module is designed to integrate seamlessly with:

1. **Sites Module**: Guard-to-site assignments
2. **Scheduling Module**: Guard availability and shift assignments
3. **Live Watch Module**: Real-time guard status and location
4. **Timesheets Module**: Guard working hours and payroll

---

## Performance Considerations

- Database indexes on frequently queried fields
- Pagination for large datasets
- Text search optimization
- Efficient filtering and sorting
- Connection pooling and query optimization

---

## Future Enhancements

1. **Photo Management**: Guard profile photo upload and storage
2. **Document Management**: Certification document storage
3. **Mobile API**: Optimized endpoints for mobile applications
4. **Real-time Updates**: WebSocket integration for live updates
5. **Advanced Analytics**: Performance metrics and reporting
6. **Notification System**: Certification expiry alerts
7. **Bulk Operations**: Import/export and bulk updates
8. **Advanced Search**: Full-text search with fuzzy matching
