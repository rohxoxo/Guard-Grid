# Guards Feature Implementation

## 🎯 Overview

The Guards feature is a comprehensive guard management system designed for security companies, specifically tailored for managing Loss Prevention Officers at Sobeys and general security guards. This implementation follows enterprise-grade software development practices with robust validation, error handling, and scalable architecture.

## 🏗️ Architecture

### Files Created/Modified

1. **Types & Interfaces** (`src/types/types.ts`)
   - `IGuard` - Main guard interface
   - `ICreateGuardRequest` - Guard creation request
   - `IUpdateGuardRequest` - Guard update request
   - `IGuardQuery` - Query parameters interface

2. **Database Model** (`src/model/guardModel.ts`)
   - Mongoose schema with comprehensive validation
   - Indexes for performance optimization
   - Business logic methods and static functions
   - Middleware for certification expiry monitoring

3. **Service Layer** (`src/services/guardService.ts`)
   - Business logic implementation
   - CRUD operations with error handling
   - Advanced querying and filtering
   - Site assignment management
   - Statistical reporting

4. **Validation Middleware** (`src/middleware/guardValidation.ts`)
   - Request validation for create/update operations
   - Query parameter validation
   - Canadian-specific validation (postal codes, provinces)
   - Comprehensive error messages

5. **Controller** (`src/controller/guardsController.ts`)
   - HTTP request/response handling
   - Following existing project patterns
   - Consistent error handling
   - Proper status codes

6. **Router** (`src/router/guardsRouter.ts`)
   - RESTful API endpoints
   - Middleware integration
   - Route organization

7. **Integration** (`src/router/apiRouter.ts`)
   - Integrated guards routes into main API
   - Maintains existing structure

8. **Constants** (`src/constant/responseMessage.ts`)
   - Guard-specific response messages
   - Consistent messaging across the API

## 🚀 Features Implemented

### Core CRUD Operations

- ✅ Create new guards with full validation
- ✅ Retrieve guards with filtering and pagination
- ✅ Update guard information
- ✅ Soft delete (terminate) guards
- ✅ Permanent deletion (admin only)

### Advanced Functionality

- ✅ Search guards by text (name, email, employee ID)
- ✅ Filter by status, employment type, skills
- ✅ Sort by various fields
- ✅ Site assignment management
- ✅ Certification expiry tracking
- ✅ Statistical reporting
- ✅ Available guards lookup
- ✅ Skills-based filtering

### Data Validation

- ✅ Canadian postal code validation
- ✅ Province validation (all Canadian provinces)
- ✅ Phone number validation (North American format)
- ✅ Email validation
- ✅ Date validation with business rules
- ✅ Hourly rate validation ($15-$100)
- ✅ Unique constraints (employee ID, email, license number)

### Security & Performance

- ✅ Input sanitization and validation
- ✅ Database indexes for performance
- ✅ Error handling and logging
- ✅ Mongoose ODM for SQL injection prevention
- ✅ Request pagination for large datasets

## 📊 Database Schema

### Guard Model Features

- **Personal Information**: Name, contact details, address
- **Employment Details**: Hire date, type, hourly rate, status
- **Certifications**: Security license (required), First aid, Loss prevention
- **Skills**: Array of guard capabilities
- **Site Assignments**: Array of assigned site IDs
- **Emergency Contact**: Required contact information
- **Audit Fields**: Created/updated timestamps

### Indexes for Performance

- Employment status and type
- Name combinations
- Skills array
- Site assignments
- Certification expiry dates
- Text search index

## 🔌 API Endpoints

```
POST   /api/v1/guards                           # Create guard
GET    /api/v1/guards                           # Get all guards (filtered/paginated)
GET    /api/v1/guards/:id                       # Get guard by ID
GET    /api/v1/guards/employee/:employeeId      # Get guard by employee ID
PUT    /api/v1/guards/:id                       # Update guard
DELETE /api/v1/guards/:id                       # Terminate guard (soft delete)
DELETE /api/v1/guards/:id/permanent             # Permanently delete guard

POST   /api/v1/guards/:id/assign-site           # Assign guard to site
POST   /api/v1/guards/:id/remove-site           # Remove guard from site

GET    /api/v1/guards/available                 # Get available guards
GET    /api/v1/guards/search                    # Search guards
GET    /api/v1/guards/statistics                # Get guard statistics
GET    /api/v1/guards/expiring-certifications   # Get guards with expiring certs
GET    /api/v1/guards/by-skill/:skill          # Get guards by skill
```

## 🧪 Testing

### Test Files Created

- `test/guards-api-examples.md` - Comprehensive API documentation with examples
- `test/test-guards-api.js` - Automated test script for API endpoints

### Testing Instructions

1. **Start the server:**

   ```bash
   npm run dev
   ```

2. **Ensure MongoDB is running:**

   ```bash
   # If using local MongoDB
   mongod
   ```

3. **Set up environment variables:**

   ```bash
   # Copy the example file
   cp env.example .env.development
   # Edit .env.development with your MongoDB connection string
   ```

4. **Run the test script:**
   ```bash
   node test/test-guards-api.js
   ```

## 📈 Statistics & Reporting

The system provides comprehensive statistics:

- Total guards count
- Breakdown by employment status
- Employment type distribution
- Guards with expiring certifications
- Available guard count

## 🔒 Security Considerations

### Implemented

- Input validation and sanitization
- Mongoose ODM prevents SQL injection
- Error handling prevents information leakage
- Unique constraints prevent duplicates

### Future Enhancements

- Authentication middleware
- Authorization based on roles
- Rate limiting
- API key management
- Audit logging

## 🚀 Integration Points

### Ready for Integration With:

1. **Sites Module**: Site assignment functionality is ready
2. **Scheduling Module**: Guard availability queries implemented
3. **Live Watch Module**: Guard status tracking foundation
4. **Timesheets Module**: Employment details and rates available

### Future Modules

- Photo upload for profile images
- Document management for certifications
- Notification system for expiry alerts
- Mobile API optimization

## 📝 Code Quality

### Following Project Standards

- ✅ TypeScript with strict typing
- ✅ ESLint configuration compliance
- ✅ Prettier formatting
- ✅ Consistent error handling patterns
- ✅ Logging with Winston
- ✅ MongoDB with Mongoose ODM

### Best Practices Implemented

- Repository pattern with service layer
- Input validation middleware
- Consistent API response format
- Comprehensive error handling
- Database indexing for performance
- Pagination for large datasets

## 🔧 Configuration

### Environment Variables Required

```
ENV=development
PORT=3000
SERVER_URL=http://localhost
DATABASE_URL=mongodb://localhost:27017/guard-grid-dev
```

### MongoDB Setup

The system will automatically create the required database and collections. Ensure MongoDB is running and accessible via the DATABASE_URL.

## 📖 Usage Examples

### Creating a Guard

```javascript
const newGuard = {
  employeeId: 'GRD001',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com'
  // ... other required fields
}

const response = await fetch('/api/v1/guards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newGuard)
})
```

### Querying Guards

```javascript
// Get active full-time guards, sorted by name
const response = await fetch('/api/v1/guards?status=active&employmentType=full-time&sortBy=firstName&sortOrder=asc')

// Search for guards
const searchResponse = await fetch('/api/v1/guards/search?q=john&limit=10')
```

## 🛠️ Maintenance

### Regular Tasks

1. Monitor certification expiry dates
2. Review guard statistics
3. Clean up terminated guards (if needed)
4. Update indexes based on query patterns

### Performance Optimization

- Database indexes are already implemented
- Pagination prevents large data loads
- Text search is optimized with MongoDB text indexes

## 🚨 Known Limitations

1. **Authentication**: Not yet implemented - will be added in future iterations
2. **File Uploads**: Profile images are URL-based only
3. **Real-time Updates**: WebSocket integration pending
4. **Bulk Operations**: Import/export functionality not implemented

## 🎯 Next Steps

1. Implement authentication and authorization
2. Add photo upload functionality
3. Create notification system for expiring certifications
4. Develop mobile-optimized endpoints
5. Add bulk import/export capabilities
6. Implement audit trail logging
7. Create dashboard widgets for statistics

---

## 🏆 Success Metrics

The Guards feature has been successfully implemented with:

- ✅ 14 fully functional API endpoints
- ✅ Comprehensive validation and error handling
- ✅ Professional-grade database schema
- ✅ Performance-optimized queries
- ✅ Complete test documentation
- ✅ Integration-ready architecture

This implementation provides a solid foundation for managing security guards in the Guard-Grid SaaS platform, specifically designed for security companies serving Sobeys and other retail locations.
