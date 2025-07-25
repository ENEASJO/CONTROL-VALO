# Project Structure

## Root Organization
```
control-valorizaciones-obras/
├── frontend/          # React TypeScript application
├── backend/           # Node.js Express API
├── .kiro/            # Kiro configuration and specs
├── node_modules/     # Root dependencies
└── package.json      # Root package with scripts
```

## Frontend Structure (`frontend/`)
```
src/
├── components/       # Reusable UI components
│   ├── Common/      # Generic components (DataTable, ConfirmDialog)
│   ├── Forms/       # Form components (ObraForm, EmpresaForm)
│   └── Layout/      # Layout components (Sidebar, Layout)
├── hooks/           # Custom React hooks
├── pages/           # Page components organized by module
│   ├── Dashboard/   # Dashboard page
│   ├── Ejecucion/   # Execution module pages
│   ├── Supervision/ # Supervision module pages
│   └── Empresas/    # Companies management pages
├── services/        # API service layer
├── types/           # TypeScript type definitions
├── App.tsx          # Main app component
└── main.tsx         # Application entry point
```

## Backend Structure (`backend/`)
```
src/
├── controllers/     # Request handlers by module
├── middleware/      # Express middleware
├── routes/          # Route definitions by module
├── types/           # TypeScript type definitions
└── index.ts         # Server entry point

prisma/
├── schema.prisma    # Database schema
└── seed.ts          # Database seeding
```

## Module Organization
The application follows a **module-based architecture** with two main modules:
- **Ejecucion** (Execution)
- **Supervision** (Supervision)

Each module has:
- Dedicated pages in `frontend/src/pages/[Module]/`
- Custom hooks in `frontend/src/hooks/use[Module].ts`
- Service layer in `frontend/src/services/[module]Service.ts`
- Backend controller in `backend/src/controllers/[module]Controller.ts`
- Backend routes in `backend/src/routes/[module].ts`

## Naming Conventions
- **Files**: camelCase for TypeScript files, PascalCase for React components
- **Components**: PascalCase (e.g., `ObraForm.tsx`)
- **Hooks**: camelCase starting with "use" (e.g., `useEjecucion.ts`)
- **Services**: camelCase ending with "Service" (e.g., `ejecucionService.ts`)
- **Types**: PascalCase interfaces, camelCase for properties
- **Database**: snake_case for table and column names

## Key Patterns
- **Separation of Concerns**: Clear separation between modules (Ejecucion/Supervision)
- **Service Layer**: API calls abstracted into service files
- **Custom Hooks**: Business logic encapsulated in custom hooks
- **Form Management**: React Hook Form for all form handling
- **Type Safety**: Shared types between frontend and backend
- **Component Reusability**: Common components in `components/Common/`