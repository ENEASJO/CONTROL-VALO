# Design Document

## Overview

The deployment fix addresses the critical issue where the Vercel deployment fails because the backend API entry point (`backend/api/index.ts`) is incomplete. The current entry point only has basic health check routes but doesn't include the full application routes and middleware that exist in the development server (`backend/src/index.ts`). This design will create a proper serverless-compatible API entry point that includes all existing functionality.

## Architecture

### Current Problem
- **Development Server**: Uses `backend/src/index.ts` with full Express app setup
- **Production Entry**: Uses `backend/api/index.ts` with minimal functionality
- **Missing Integration**: Production entry doesn't include routes, middleware, or controllers

### Solution Architecture
```
Vercel Serverless Function
├── backend/api/index.ts (Enhanced Entry Point)
│   ├── Express App Setup
│   ├── Middleware Integration
│   ├── Route Integration
│   ├── Error Handling
│   └── Prisma Configuration
└── Existing Backend Structure
    ├── controllers/
    ├── middleware/
    ├── routes/
    └── types/
```

## Components and Interfaces

### 1. Enhanced API Entry Point (`backend/api/index.ts`)

**Purpose**: Serverless-compatible Express app that includes all application functionality

**Key Components**:
- **Prisma Client**: Singleton pattern for serverless environment
- **Express App**: Configured with all middleware and routes
- **CORS Configuration**: Proper cross-origin setup for production
- **Route Integration**: Include all existing routes (empresas, ejecucion, supervision)
- **Error Handling**: Comprehensive error middleware
- **Health Checks**: Enhanced health endpoint with database connectivity test

**Interface**:
```typescript
// Main export for Vercel
export default (req: VercelRequest, res: VercelResponse) => Promise<void>

// Prisma singleton export
export { prisma }
```

### 2. Middleware Integration

**Components to Include**:
- `errorHandler`: Comprehensive error handling with Prisma error mapping
- `notFoundHandler`: 404 handling for undefined routes
- `requestLogger`: Request/response logging (adapted for serverless)
- `validation`: Request validation middleware

**Serverless Adaptations**:
- Simplified logging for serverless environment
- Error handling optimized for function execution
- Request/response cycle adapted for Vercel functions

### 3. Route Integration

**Routes to Include**:
- `/api/health` - Enhanced health check with database test
- `/api/empresas/*` - Company management routes
- `/api/ejecucion/*` - Execution project routes  
- `/api/supervision/*` - Supervision project routes

**Route Mapping**:
```
Vercel Route → Backend Route
/api/empresas → empresasRoutes
/api/ejecucion → ejecucionRoutes
/api/supervision → supervisionRoutes
```

### 4. Database Configuration

**Prisma Setup**:
- Singleton pattern for connection reuse
- Production-optimized connection pooling
- Proper connection cleanup for serverless
- Environment-specific configuration

**Connection Strategy**:
```typescript
// Singleton for serverless efficiency
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
} else {
  // Development reuse pattern
  if (!global.__prisma) {
    global.__prisma = new PrismaClient()
  }
  prisma = global.__prisma
}
```

## Data Models

### Environment Variables
```typescript
interface EnvironmentConfig {
  DATABASE_URL: string      // Supabase connection string
  NODE_ENV: string         // production | development
  CORS_ORIGIN?: string     // Frontend URL for CORS
}
```

### API Response Format
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

## Error Handling

### Serverless Error Strategy
1. **Prisma Errors**: Map database errors to user-friendly messages
2. **Validation Errors**: Return structured validation feedback
3. **Not Found Errors**: Handle missing routes and resources
4. **Internal Errors**: Log and return generic error messages
5. **Timeout Handling**: Manage serverless function timeouts

### Error Response Format
```typescript
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'User-friendly message',
    details?: 'Additional context for debugging'
  }
}
```

## Testing Strategy

### 1. Local Testing
- Test enhanced API entry point locally
- Verify all routes work through new entry point
- Validate middleware integration
- Test database connectivity

### 2. Deployment Testing
- Deploy to Vercel preview environment
- Test all API endpoints in production
- Verify frontend-backend communication
- Test database operations with Supabase

### 3. Integration Testing
- Test complete user workflows
- Verify CORS configuration
- Test error handling scenarios
- Validate performance under load

### 4. Health Check Enhancement
```typescript
GET /api/health
Response: {
  success: true,
  message: 'API funcionando correctamente',
  timestamp: '2024-01-01T00:00:00.000Z',
  version: '1.0.0',
  database: 'connected',
  environment: 'production'
}
```

## Implementation Considerations

### Serverless Optimizations
- **Cold Start Reduction**: Minimize initialization time
- **Memory Efficiency**: Optimize imports and dependencies
- **Connection Reuse**: Implement proper singleton patterns
- **Error Recovery**: Handle transient failures gracefully

### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### Vercel Configuration Updates
- Ensure `vercel.json` properly includes Prisma files
- Configure function memory and timeout settings
- Set up proper environment variable handling
- Configure build and deployment settings

This design ensures that the production deployment will have the same functionality as the development environment while being optimized for Vercel's serverless platform.