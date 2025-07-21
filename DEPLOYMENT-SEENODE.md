# 🚀 Guía de Despliegue en SeeNode

## Arquitectura de Despliegue SeeNode

- **Backend:** SeeNode (Node.js hosting)
- **Frontend:** SeeNode (Static hosting) o Netlify
- **Base de Datos:** Supabase (gratis) o Railway
- **Costo:** Desde $0-5/mes

## 📋 Preparación del Proyecto para SeeNode

### 1. Configurar Backend para SeeNode

SeeNode requiere una estructura diferente a Vercel. Necesitamos usar el servidor Express tradicional en lugar de funciones serverless.

#### Crear archivo de entrada para SeeNode:

```javascript
// server.js (archivo principal para SeeNode)
const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

// Importar la aplicación backend
const backendApp = require('./backend/src/index.js')

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')))

// API routes
app.use('/api', backendApp)

// Servir el frontend para todas las rutas no-API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`)
  console.log(`📊 API disponible en http://localhost:${PORT}/api`)
})
```

### 2. Modificar Backend para SeeNode

Necesitamos adaptar el backend para que funcione como aplicación Express tradicional:

```javascript
// backend/src/app.js (nueva estructura para SeeNode)
const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')
const { errorHandler } = require('./middleware/errorHandler')
const { notFoundHandler } = require('./middleware/notFoundHandler')
const { requestLogger } = require('./middleware/requestLogger')
const empresasRoutes = require('./routes/empresas')
const ejecucionRoutes = require('./routes/ejecucion')
const supervisionRoutes = require('./routes/supervision')

// Inicializar Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

const app = express()

// Middleware básico
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger)

// Rutas de salud
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      success: true,
      message: 'API de Control de Valorizaciones funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    console.error('❌ Database connection error:', error)
    res.status(503).json({
      success: false,
      message: 'API funcionando pero sin conexión a base de datos',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    })
  }
})

// Rutas principales
app.use('/empresas', empresasRoutes)
app.use('/ejecucion', ejecucionRoutes)
app.use('/supervision', supervisionRoutes)

// Middleware de manejo de errores
app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
```

## 🔧 Pasos de Configuración en SeeNode

### 1. Crear Cuenta en SeeNode

1. **Registrarse en SeeNode:**
   - Ir a [seenode.com](https://seenode.com)
   - Crear cuenta gratuita o de pago
   - Verificar email

### 2. Configurar Proyecto

1. **Crear nuevo proyecto:**
   - Dashboard → "New Project"
   - Conectar con GitHub
   - Seleccionar tu repositorio

2. **Configurar Build Settings:**
   ```
   Build Command: npm run build:seenode
   Start Command: npm start
   Node Version: 18.x
   ```

### 3. Variables de Entorno

Configurar en SeeNode Dashboard → Settings → Environment Variables:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
NODE_ENV=production
CORS_ORIGIN=https://tu-dominio.seenode.com
PORT=3000
```

## 📦 Configuración de Package.json

Agregar scripts específicos para SeeNode:

```json
{
  "scripts": {
    "build:seenode": "npm run build:frontend && npm run build:backend",
    "start": "node server.js",
    "dev:seenode": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

## 🗄️ Configuración de Base de Datos

### Opción 1: Supabase (Recomendado - Gratis)

```bash
# Usar la misma configuración que tienes
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

### Opción 2: Railway (Alternativa)

1. Crear cuenta en [railway.app](https://railway.app)
2. Crear proyecto PostgreSQL
3. Obtener URL de conexión
4. Configurar en variables de entorno

## 🚀 Proceso de Deployment

### 1. Preparar Archivos

Crear los archivos necesarios para SeeNode:
###
 2. Subir Cambios a GitHub

```bash
git add .
git commit -m "🚀 Add: Configuración para deployment en SeeNode"
git push origin master
```

### 3. Configurar en SeeNode

1. **Crear Proyecto:**
   - Dashboard → "New Project"
   - Conectar repositorio GitHub
   - Seleccionar rama `master`

2. **Build Settings:**
   ```
   Build Command: npm run build:seenode
   Start Command: npm start
   Node Version: 18.x
   Install Command: npm run install:all
   ```

3. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   NODE_ENV=production
   CORS_ORIGIN=https://tu-app.seenode.com
   PORT=3000
   ```

## 🔄 Diferencias con Vercel

| Aspecto | Vercel | SeeNode |
|---------|--------|---------|
| **Arquitectura** | Serverless Functions | Servidor Node.js tradicional |
| **Entrada** | `backend/api/index.ts` | `server.js` |
| **Build** | Automático | `npm run build:seenode` |
| **Start** | Función export | `npm start` |
| **Costo** | Gratis con límites | Desde $5/mes |
| **Escalabilidad** | Auto-scaling | Manual scaling |

## 🧪 Testing Local para SeeNode

Crear script de test específico:

```bash
# Test local SeeNode
npm run build:seenode
npm run dev:seenode
```

Verificar endpoints:
- `http://localhost:3000/health` - Salud del servidor
- `http://localhost:3000/api/health` - Salud de la API
- `http://localhost:3000/api/test` - Test de rutas
- `http://localhost:3000` - Frontend

## 📊 Monitoreo y Logs

### En SeeNode Dashboard:

1. **Logs en Tiempo Real:**
   - Dashboard → Logs
   - Ver errores y requests

2. **Métricas:**
   - CPU y memoria usage
   - Response times
   - Error rates

3. **Health Checks:**
   - Configurar en `/health`
   - Alertas automáticas

## 🔧 Troubleshooting SeeNode

### Problemas Comunes:

1. **Build Fails:**
   ```bash
   # Verificar dependencias
   npm run install:all
   npm run build:seenode
   ```

2. **Database Connection:**
   ```bash
   # Verificar URL de conexión
   echo $DATABASE_URL
   ```

3. **Frontend No Carga:**
   ```bash
   # Verificar build del frontend
   ls -la frontend/dist/
   ```

4. **API No Responde:**
   ```bash
   # Verificar logs del servidor
   tail -f logs/app.log
   ```

## 🚀 Deployment Automático

### GitHub Actions para SeeNode:

```yaml
# .github/workflows/seenode-deploy.yml
name: Deploy to SeeNode

on:
  push:
    branches: [ master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm run install:all
      
    - name: Build application
      run: npm run build:seenode
      
    - name: Deploy to SeeNode
      run: |
        # Comando específico de SeeNode para deploy
        seenode deploy --project=${{ secrets.SEENODE_PROJECT_ID }}
```

## 💰 Costos Estimados

### SeeNode Pricing:

- **Starter:** $5/mes
  - 1 GB RAM
  - 10 GB Storage
  - 100 GB Bandwidth

- **Pro:** $15/mes
  - 2 GB RAM
  - 25 GB Storage
  - 250 GB Bandwidth

- **Business:** $35/mes
  - 4 GB RAM
  - 50 GB Storage
  - 500 GB Bandwidth

### Comparación Total:

| Servicio | SeeNode + Supabase | Vercel + Supabase |
|----------|-------------------|-------------------|
| **Hosting** | $5-35/mes | Gratis |
| **Database** | Gratis | Gratis |
| **Total** | $5-35/mes | $0/mes |

## 🎯 Recomendación

**Para tu proyecto, recomiendo:**

1. **Desarrollo/Testing:** Vercel (gratis)
2. **Producción pequeña:** SeeNode Starter ($5/mes)
3. **Producción grande:** SeeNode Pro+ ($15+/mes)

**Ventajas de SeeNode:**
- ✅ Servidor tradicional (más familiar)
- ✅ Mejor para aplicaciones con estado
- ✅ Logs más detallados
- ✅ Control total del servidor

**Ventajas de Vercel:**
- ✅ Completamente gratis
- ✅ Auto-scaling
- ✅ Deploy automático
- ✅ CDN global

## 📝 Próximos Pasos

1. **Probar localmente:**
   ```bash
   npm run dev:seenode
   ```

2. **Subir cambios:**
   ```bash
   git add .
   git commit -m "Add SeeNode configuration"
   git push
   ```

3. **Configurar en SeeNode:**
   - Crear cuenta
   - Conectar repositorio
   - Configurar variables de entorno
   - Deploy!

¿Quieres que proceda con alguno de estos pasos?