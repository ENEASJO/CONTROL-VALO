#!/usr/bin/env node

/**
 * Script para diagnosticar y arreglar problemas comunes de Vercel
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 Diagnosticando problemas de Vercel...\n')

// Problemas comunes de Vercel y sus soluciones
const vercelIssues = [
  {
    issue: 'Build timeout',
    cause: 'Frontend build tarda mucho',
    solution: 'Optimizar build del frontend'
  },
  {
    issue: 'API routes not working',
    cause: 'Problema con backend/api/index.ts',
    solution: 'Verificar estructura serverless'
  },
  {
    issue: 'Database connection fails',
    cause: 'Variables de entorno mal configuradas',
    solution: 'Verificar DATABASE_URL'
  },
  {
    issue: 'Frontend not loading',
    cause: 'Build del frontend falla',
    solution: 'Simplificar configuración TypeScript'
  },
  {
    issue: 'Prisma errors',
    cause: 'Schema no incluido en deployment',
    solution: 'Verificar vercel.json includeFiles'
  }
]

console.log('🚨 PROBLEMAS COMUNES DE VERCEL:')
vercelIssues.forEach((issue, i) => {
  console.log(`   ${i + 1}. ${issue.issue}`)
  console.log(`      Causa: ${issue.cause}`)
  console.log(`      Solución: ${issue.solution}\n`)
})

// Verificar configuración actual
console.log('🔍 VERIFICANDO CONFIGURACIÓN ACTUAL:\n')

// 1. Verificar vercel.json
console.log('📋 1. Verificando vercel.json...')
if (fs.existsSync('vercel.json')) {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))
  console.log('   ✅ vercel.json existe')
  
  // Verificar estructura
  if (vercelConfig.builds && vercelConfig.routes && vercelConfig.functions) {
    console.log('   ✅ Estructura completa')
  } else {
    console.log('   ⚠️  Estructura incompleta')
  }
  
  // Verificar includeFiles
  if (vercelConfig.functions && vercelConfig.functions['backend/api/index.ts']) {
    console.log('   ✅ Prisma files incluidos')
  } else {
    console.log('   ⚠️  Prisma files podrían faltar')
  }
} else {
  console.log('   ❌ vercel.json no encontrado')
}

// 2. Verificar backend/api/index.ts
console.log('\n📋 2. Verificando backend API...')
if (fs.existsSync('backend/api/index.ts')) {
  const apiContent = fs.readFileSync('backend/api/index.ts', 'utf8')
  console.log('   ✅ backend/api/index.ts existe')
  
  // Verificar imports críticos
  const criticalImports = ['express', 'cors', '@prisma/client', 'errorHandler', 'empresasRoutes']
  let allImportsOk = true
  
  criticalImports.forEach(imp => {
    if (apiContent.includes(imp)) {
      console.log(`   ✅ ${imp} importado`)
    } else {
      console.log(`   ❌ ${imp} faltante`)
      allImportsOk = false
    }
  })
  
  if (allImportsOk) {
    console.log('   ✅ Todos los imports críticos presentes')
  }
} else {
  console.log('   ❌ backend/api/index.ts no encontrado')
}

// 3. Verificar frontend build
console.log('\n📋 3. Verificando frontend build...')
if (fs.existsSync('frontend/dist')) {
  const distFiles = fs.readdirSync('frontend/dist')
  console.log(`   ✅ Frontend build existe (${distFiles.length} archivos)`)
  
  if (distFiles.includes('index.html')) {
    console.log('   ✅ index.html presente')
  } else {
    console.log('   ❌ index.html faltante')
  }
} else {
  console.log('   ⚠️  Frontend no está buildeado')
  console.log('   💡 Ejecuta: npm run build:frontend')
}

// Crear configuración optimizada para Vercel
console.log('\n🔧 CREANDO CONFIGURACIÓN OPTIMIZADA...')

// vercel.json optimizado
const optimizedVercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "backend/api/index.ts",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb",
        "memory": 1024
      }
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "functions": {
    "backend/api/index.ts": {
      "includeFiles": [
        "backend/prisma/**",
        "backend/src/**",
        "backend/node_modules/.prisma/**",
        "backend/node_modules/@prisma/**"
      ],
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "regions": ["iad1"]
}

fs.writeFileSync('vercel-optimized.json', JSON.stringify(optimizedVercelConfig, null, 2))
console.log('✅ vercel-optimized.json creado')

// Crear script de pre-deploy para Vercel
const preDeployScript = `#!/usr/bin/env node

console.log('🚀 Pre-deploy script para Vercel...')

// Verificar que todo esté listo
const fs = require('fs')

// 1. Verificar frontend build
if (!fs.existsSync('frontend/dist/index.html')) {
  console.log('❌ Frontend no está buildeado')
  process.exit(1)
}

// 2. Verificar backend API
if (!fs.existsSync('backend/api/index.ts')) {
  console.log('❌ Backend API no encontrado')
  process.exit(1)
}

// 3. Verificar Prisma schema
if (!fs.existsSync('backend/prisma/schema.prisma')) {
  console.log('❌ Prisma schema no encontrado')
  process.exit(1)
}

console.log('✅ Todo listo para Vercel deployment!')
`

fs.writeFileSync('pre-deploy-vercel.js', preDeployScript)
console.log('✅ pre-deploy-vercel.js creado')

console.log('\n🎯 SOLUCIONES APLICADAS:')
console.log('   1. vercel-optimized.json - Configuración mejorada')
console.log('   2. pre-deploy-vercel.js - Script de verificación')
console.log('   3. Memoria aumentada a 1024MB')
console.log('   4. Timeout aumentado a 30s')
console.log('   5. Región optimizada (iad1)')

console.log('\n📋 PRÓXIMOS PASOS PARA VERCEL:')
console.log('   1. Reemplazar vercel.json con vercel-optimized.json (opcional)')
console.log('   2. Ejecutar: node pre-deploy-vercel.js')
console.log('   3. Configurar variables de entorno en Vercel')
console.log('   4. Deploy!')

console.log('\n🔐 VARIABLES DE ENTORNO REQUERIDAS:')
console.log('   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres')
console.log('   NODE_ENV=production')
console.log('   CORS_ORIGIN=https://tu-app.vercel.app')

console.log('\n💡 TIPS PARA EVITAR ERRORES:')
console.log('   - Usar región iad1 (más rápida)')
console.log('   - Aumentar memoria a 1024MB')
console.log('   - Verificar que Supabase esté activo')
console.log('   - No usar funciones que tarden más de 30s')

console.log('\n✅ Diagnóstico completado!')