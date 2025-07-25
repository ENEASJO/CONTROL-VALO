# 🗄️ Configuración Rápida de Supabase

## Paso 1: Crear Proyecto en Supabase
1. Ir a [supabase.com](https://supabase.com)
2. Crear cuenta (usar GitHub)
3. "New Project" > Nombre: `control-valorizaciones-obras`
4. Región: `South America (São Paulo)`
5. **ANOTAR LA CONTRASEÑA** 🔑

## Paso 2: Obtener URL de Conexión
1. Dashboard > Settings > Database
2. Copiar "Connection string":
   ```
   postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
   ```

## Paso 3: Configurar Localmente
```bash
# Crear archivo .env
cp backend/.env.example backend/.env

# Editar backend/.env y pegar tu URL de Supabase
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-REF].supabase.co:5432/postgres"
```

## Paso 4: Migrar Base de Datos
```bash
cd backend
npm run db:migrate
npm run db:seed
```

## Paso 5: Configurar Vercel
1. Dashboard de Vercel > Tu proyecto > Settings > Environment Variables
2. Agregar:
   - `DATABASE_URL` = tu URL de Supabase
   - `NODE_ENV` = production

## Paso 6: Desplegar
```bash
git add .
git commit -m "Configurar Supabase"
git push origin main
```

## ✅ Verificar que Funciona
- Frontend: `https://tu-proyecto.vercel.app`
- API: `https://tu-proyecto.vercel.app/api/health`
- Base de datos: Dashboard de Supabase > Table Editor

## 🆘 Si algo falla:
1. Verificar que la URL de Supabase esté correcta
2. Verificar que la contraseña no tenga caracteres especiales
3. Revisar logs en Vercel dashboard
4. Probar conexión local primero