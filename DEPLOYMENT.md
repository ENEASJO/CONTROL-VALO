# 🚀 Guía de Despliegue Profesional - 100% GRATUITO

## Arquitectura de Despliegue

- **Frontend + Backend:** Vercel (gratis)
- **Base de Datos:** Supabase (gratis)
- **Costo Total:** $0/mes 🎉

## 📋 Pasos de Configuración

### 1. Configurar Base de Datos en Supabase

1. **Crear cuenta en Supabase:**
   - Ir a [supabase.com](https://supabase.com)
   - Crear cuenta gratuita
   - Crear nuevo proyecto

2. **Obtener URL de conexión:**
   - En el dashboard, ir a Settings > Database
   - Copiar la "Connection string" en formato URI
   - Ejemplo: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

3. **Configurar esquema:**
   ```bash
   # Actualizar .env con la URL de Supabase
   DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
   
   # Ejecutar migraciones
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

### 2. Desplegar Frontend + Backend en Vercel (Gratis)

1. **Crear cuenta en Vercel:**
   - Ir a [vercel.com](https://vercel.com)
   - Conectar con GitHub

2. **Importar proyecto:**
   - "New Project" > Seleccionar tu repositorio
   - Framework Preset: "Other" 
   - Root Directory: dejar vacío (raíz del proyecto)
   - Build Command: `npm run build:simple`
   - Output Directory: `frontend/dist`
   - Install Command: `npm run install:all`

3. **Configurar variables de entorno en Vercel:**
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   NODE_ENV=production
   CORS_ORIGIN=https://tu-app.vercel.app
   ```

4. **Verificar despliegue:**
   - Vercel te dará una URL como: `https://tu-app.vercel.app`
   - Frontend: `https://tu-app.vercel.app`
   - API: `https://tu-app.vercel.app/api/health`
   - Test API: `https://tu-app.vercel.app/api/test`

### 3. Configurar Dominio Personalizado (Opcional)

1. **En Vercel:**
   - Settings > Domains
   - Agregar tu dominio personalizado

## 🔧 URLs Finales

Una vez configurado, tendrás:

- **Aplicación Completa:** `https://control-valorizaciones.vercel.app`
- **API:** `https://control-valorizaciones.vercel.app/api`
- **Base de Datos:** Supabase (acceso interno)

## 👥 Acceso del Equipo

Cada miembro del equipo puede:

1. **Acceder a la aplicación:**
   - URL: `https://control-valorizaciones.vercel.app`
   - No necesita instalación local

2. **Desarrollar localmente (opcional):**
   ```bash
   git clone [tu-repositorio]
   npm run install:all
   
   # Configurar .env con URLs de producción
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   npm run dev
   ```

## 💰 Costos

- **Supabase:** Gratis (hasta 500MB de BD, 2GB de transferencia)
- **Vercel:** Gratis (100GB de ancho de banda, funciones serverless)
- **Total:** $0/mes 🎉

## 📊 Límites Gratuitos

- **Supabase:** 500MB BD, 2GB transferencia/mes
- **Vercel:** 100GB ancho de banda, 100 despliegues/día
- **Perfecto para equipos pequeños y medianos**

## 🔄 Actualizaciones Automáticas

- Cada push a `main` despliega automáticamente
- Vercel redespliega frontend y backend juntos
- Zero downtime deployments

## 🛠️ Comandos Útiles

```bash
# Verificar estado de servicios
curl https://tu-app.vercel.app/api/health

# Ver logs de Vercel
vercel logs

# Desplegar manualmente
npm run deploy

# Preview deployment
npm run deploy:preview
```

## 🆘 Solución de Problemas

### Backend no responde:
1. Verificar variables de entorno en Vercel
2. Revisar logs en Vercel dashboard
3. Verificar conexión a Supabase
4. Verificar que las funciones serverless estén activas

### Frontend no carga datos:
1. Verificar que la API esté en la misma URL
2. Revisar CORS configuration
3. Probar API directamente: `/api/health`

### Base de datos no conecta:
1. Verificar DATABASE_URL
2. Revisar límites de Supabase
3. Verificar IP whitelist en Supabase