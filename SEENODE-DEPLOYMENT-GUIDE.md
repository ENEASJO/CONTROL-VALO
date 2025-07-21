# 🚀 Guía Paso a Paso - Deployment en SeeNode

## 📋 Checklist Pre-Deployment

✅ **Configuración verificada** - Tests pasaron  
✅ **Código en GitHub** - Último commit subido  
✅ **Frontend compilado** - Build exitoso  
✅ **Backend configurado** - App.js listo  

## 🔗 Paso 1: Crear Cuenta en SeeNode

1. **Ir a SeeNode:**
   - Visita: [https://seenode.com](https://seenode.com)
   - Click en "Sign Up" o "Get Started"

2. **Registrarse:**
   - Email: tu-email@ejemplo.com
   - Password: (crear password seguro)
   - Verificar email

3. **Seleccionar Plan:**
   - **Starter ($5/mes)**: Perfecto para tu aplicación
     - 1 GB RAM
     - 10 GB Storage
     - 100 GB Bandwidth
   - **Pro ($15/mes)**: Si necesitas más recursos

## 🔧 Paso 2: Configurar Proyecto

### 2.1 Crear Nuevo Proyecto

1. **En SeeNode Dashboard:**
   - Click "New Project" o "Create Project"
   - Nombre: `control-valorizaciones-obras`
   - Descripción: `Sistema de Control de Valorizaciones`

### 2.2 Conectar GitHub

1. **Conectar Repositorio:**
   - Seleccionar "GitHub" como fuente
   - Autorizar SeeNode a acceder a GitHub
   - Seleccionar repositorio: `ENEASJO/CONTROL-VALO`
   - Branch: `master`

### 2.3 Configurar Build Settings

```
Framework: Node.js
Node Version: 18.x
Build Command: npm run build:seenode
Start Command: npm start
Install Command: npm run install:all
Root Directory: / (dejar vacío)
```

## 🔐 Paso 3: Variables de Entorno

### 3.1 Configurar Base de Datos (Supabase)

Si no tienes Supabase configurado:

1. **Ir a Supabase:**
   - [https://supabase.com](https://supabase.com)
   - Crear cuenta gratuita
   - "New Project"

2. **Obtener URL de Conexión:**
   - Settings → Database
   - Connection string (URI format)
   - Ejemplo: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

### 3.2 Configurar en SeeNode

En SeeNode Dashboard → Settings → Environment Variables:

```bash
# REQUERIDAS
DATABASE_URL=postgresql://postgres:[TU_PASSWORD]@db.[TU_PROJECT].supabase.co:5432/postgres
NODE_ENV=production

# OPCIONALES
CORS_ORIGIN=https://tu-app.seenode.com
PORT=3000
```

**⚠️ IMPORTANTE:** Reemplaza `[TU_PASSWORD]` y `[TU_PROJECT]` con tus valores reales.

## 🚀 Paso 4: Deploy

### 4.1 Iniciar Deployment

1. **En SeeNode Dashboard:**
   - Click "Deploy" o "Build & Deploy"
   - SeeNode comenzará el proceso automáticamente

### 4.2 Monitorear Build

Verás logs en tiempo real:
```
📦 Installing dependencies...
🔨 Building frontend...
🚀 Starting server...
✅ Deployment successful!
```

### 4.3 Verificar Deployment

Una vez completado:
- **URL de la app:** `https://tu-app.seenode.com`
- **API Health:** `https://tu-app.seenode.com/api/health`
- **Test endpoint:** `https://tu-app.seenode.com/api/test`

## 🧪 Paso 5: Testing en Producción

### 5.1 Verificar Endpoints

```bash
# Health check
curl https://tu-app.seenode.com/api/health

# Test endpoint
curl https://tu-app.seenode.com/api/test

# Empresas API
curl https://tu-app.seenode.com/api/empresas

# Frontend
# Abrir https://tu-app.seenode.com en navegador
```

### 5.2 Verificar Base de Datos

El health check debería mostrar:
```json
{
  "success": true,
  "message": "API de Control de Valorizaciones funcionando correctamente",
  "database": "connected",
  "environment": "production"
}
```

## 🔧 Paso 6: Configuración Post-Deployment

### 6.1 Configurar Dominio Personalizado (Opcional)

1. **En SeeNode Dashboard:**
   - Settings → Domains
   - Add Custom Domain
   - Seguir instrucciones DNS

### 6.2 Configurar SSL

- SeeNode incluye SSL automático
- Verificar que HTTPS funcione correctamente

### 6.3 Configurar Monitoreo

1. **Logs:**
   - Dashboard → Logs
   - Ver requests y errores en tiempo real

2. **Métricas:**
   - Dashboard → Analytics
   - CPU, memoria, response times

## 🚨 Troubleshooting

### Problema: Build Falla

**Síntomas:** Error durante npm install o build
**Solución:**
```bash
# Verificar localmente
npm run install:all
npm run build:seenode

# Si funciona local, revisar logs de SeeNode
```

### Problema: Database Connection Error

**Síntomas:** API responde pero database: "disconnected"
**Solución:**
1. Verificar DATABASE_URL en variables de entorno
2. Verificar que Supabase esté activo
3. Probar conexión desde local

### Problema: Frontend No Carga

**Síntomas:** 404 o página en blanco
**Solución:**
1. Verificar que `frontend/dist` se generó correctamente
2. Revisar logs del servidor
3. Verificar rutas en server.js

### Problema: API No Responde

**Síntomas:** 500 errors en /api/*
**Solución:**
1. Revisar logs de SeeNode
2. Verificar que backend/src/app.js se carga
3. Probar endpoints individualmente

## 📊 Monitoreo y Mantenimiento

### Logs Importantes

```bash
# Logs de aplicación
✅ Backend API cargado correctamente
📥 GET /api/health - 200 - 45ms
📤 GET /api/health - 200 - 45ms

# Logs de error
❌ Database connection error: ...
❌ Error cargando backend: ...
```

### Métricas a Monitorear

- **Response Time:** < 500ms
- **Error Rate:** < 1%
- **Memory Usage:** < 80%
- **CPU Usage:** < 70%

## 💰 Costos y Escalabilidad

### Costo Mensual Estimado

- **SeeNode Starter:** $5/mes
- **Supabase:** Gratis (hasta 500MB)
- **Total:** $5/mes

### Cuándo Escalar

**Upgrade a Pro ($15/mes) si:**
- Memory usage > 80% consistentemente
- Response times > 1 segundo
- Más de 1000 usuarios concurrentes

## 🎯 Próximos Pasos

Una vez desplegado exitosamente:

1. **Configurar CI/CD:**
   - Auto-deploy en push a master
   - Tests automáticos

2. **Configurar Backup:**
   - Backup automático de Supabase
   - Backup de configuración

3. **Optimizar Performance:**
   - CDN para assets estáticos
   - Caching de API responses

4. **Monitoreo Avanzado:**
   - Alertas por email/SMS
   - Dashboard de métricas

## 📞 Soporte

- **SeeNode Support:** support@seenode.com
- **Documentación:** [docs.seenode.com](https://docs.seenode.com)
- **Community:** Discord/Slack de SeeNode

---

¡Tu aplicación estará funcionando en producción en menos de 30 minutos! 🚀