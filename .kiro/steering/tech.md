# Technology Stack

## Architecture
Full-stack TypeScript application with separate frontend and backend services.

## Frontend Stack
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components and theming
- **React Hook Form** for form management and validation
- **React Query (@tanstack/react-query)** for server state management
- **React Router** for client-side routing
- **Axios** for HTTP requests
- **Vite** as build tool and dev server

## Backend Stack
- **Node.js** with **Express** framework
- **TypeScript** for type safety
- **Prisma ORM** for database operations
- **SQLite** as database (configured for development)
- **Joi** for request validation
- **JWT** for authentication (jsonwebtoken)

## Development Tools
- **ESLint** for code linting
- **Vitest** for frontend testing
- **Jest** for backend testing
- **tsx** for TypeScript execution in development
- **Concurrently** for running multiple services

## Common Commands

### Project Setup
```bash
# Install all dependencies
npm run install:all

# Setup database
cd backend && npm run db:migrate
cd backend && npm run db:seed
```

### Development
```bash
# Start both frontend and backend
npm run dev

# Start services individually
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:3000
```

### Database Operations
```bash
cd backend
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run migrations
npm run db:push       # Push schema changes
npm run db:seed       # Seed database
```

### Build & Test
```bash
# Build both services
npm run build

# Run tests
cd frontend && npm test
cd backend && npm test
```

## Key Dependencies
- **@prisma/client**: Database client
- **@mui/material**: UI component library
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling
- **joi**: Server-side validation