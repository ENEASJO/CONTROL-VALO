# Control de Valorizaciones de Obras
<!-- Deployment fix v2 -->

Sistema web para gestionar y registrar valorizaciones de ejecución y supervisión de proyectos de construcción.

## Características

- **Módulos Independientes**: Ejecución y Supervisión con datos separados
- **Gestión Completa**: Obras, empresas y plantel profesional
- **Diseño Moderno**: Interfaz elegante y responsiva con Material-UI
- **Validaciones Robustas**: Control de integridad de datos y porcentajes
- **Arquitectura Escalable**: React + TypeScript + Node.js + PostgreSQL

## Estructura del Proyecto

```
control-valorizaciones-obras/
├── frontend/          # Aplicación React con TypeScript
├── backend/           # API Node.js con Express y TypeScript
├── .kiro/specs/       # Documentación de especificaciones
└── README.md
```

## Instalación

1. Instalar dependencias en todos los proyectos:
```bash
npm run install:all
```

2. Configurar base de datos PostgreSQL y variables de entorno en backend/.env

3. Ejecutar migraciones de base de datos:
```bash
cd backend && npm run db:migrate
```

4. Iniciar en modo desarrollo:
```bash
npm run dev
```

## Desarrollo

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Tecnologías

### Frontend
- React 18 + TypeScript
- Material-UI (MUI)
- React Hook Form
- React Query
- React Router

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Joi (validación)

## Módulos

### Ejecución de Obras
- Registro y gestión de obras de ejecución
- Control de empresas ejecutoras y supervisoras
- Gestión de plantel profesional con porcentajes

### Supervisión de Obras
- Registro independiente de obras de supervisión
- Mismas funcionalidades que ejecución pero con datos separados
- Interfaz diferenciada visualmente

## Campos Principales

- Nombre de la obra
- Número de contrato (único por módulo)
- Número de expediente
- Período valorizado
- Fecha de inicio
- Plazo de ejecución
- Empresa ejecutora y supervisora
- Plantel profesional con cargos y porcentajes de participación