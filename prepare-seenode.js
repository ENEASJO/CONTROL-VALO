#!/usr/bin/env node

/**
 * Script para preparar el deployment en SeeNode
 * Verifica todo y genera la información necesaria
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 Preparando deployment para SeeNode...\n')

// Información del proyecto
const projectInfo = {
  name: 'control-valorizaciones-obras',
  repository: 'ENEASJO/CONTROL-VALO',
  branch: 'master',
  nodeVersion: '18.x'
}

console.log('📋 INFORMACIÓN DEL PROYECTO:')
console.log(`   Nombre: ${projectInfo.name}`)
console.log(`   Repositorio: ${projectInfo.repository}`)
console.log(`   Branch: ${projectInfo.branch}`)
console.log(`   Node Version: ${projectInfo.nodeVersion}\n`)

// Verificar archivos necesarios
console.log('📁 VERIFICANDO ARCHIVOS NECESARIOS:')

const requiredFiles = [
  'server.js',
  'backend/src/app.js',
  'seenode.config.js',
  'package.json',
  'frontend/dist/index.html'
]

let allFilesExist = true

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`)
  } else {
    console.log(`   ❌ ${file} - FALTANTE`)
    allFilesExist = false
  }
}

if (!allFilesExist) {
  console.log('\n⚠️  Algunos archivos faltan. Ejecuta:')
  console.log('   npm run build:seenode')
  console.log('   npm run test:seenode\n')
}

// Generar configuración para SeeNode
console.log('\n⚙️  CONFIGURACIÓN PARA SEENODE:')

const seeNodeConfig = {
  framework: 'Node.js',
  nodeVersion: '18.x',
  buildCommand: 'npm run build:seenode',
  startCommand: 'npm start',
  installCommand: 'npm run install:all',
  rootDirectory: '/'
}

console.log('   Framework: Node.js')
console.log('   Node Version: 18.x')
console.log('   Build Command: npm run build:seenode')
console.log('   Start Command: npm start')
console.log('   Install Command: npm run install:all')
console.log('   Root Directory: / (dejar vacío)')

// Variables de entorno
console.log('\n🔐 VARIABLES DE ENTORNO REQUERIDAS:')
console.log('   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres')
console.log('   NODE_ENV=production')
console.log('   CORS_ORIGIN=https://tu-app.seenode.com')
console.log('   PORT=3000')

// Generar checklist
console.log('\n📋 CHECKLIST PRE-DEPLOYMENT:')

const checklist = [
  'Cuenta en SeeNode creada',
  'Repositorio GitHub conectado',
  'Variables de entorno configuradas',
  'Base de datos Supabase lista',
  'Build settings configurados',
  'Tests locales pasando'
]

for (let i = 0; i < checklist.length; i++) {
  console.log(`   ${i + 1}. [ ] ${checklist[i]}`)
}

// URLs importantes
console.log('\n🔗 URLS IMPORTANTES:')
console.log('   SeeNode: https://seenode.com')
console.log('   Supabase: https://supabase.com')
console.log('   GitHub Repo: https://github.com/ENEASJO/CONTROL-VALO')

// Comandos útiles
console.log('\n🛠️  COMANDOS ÚTILES:')
console.log('   # Test configuración')
console.log('   npm run test:seenode')
console.log('')
console.log('   # Build para producción')
console.log('   npm run build:seenode')
console.log('')
console.log('   # Test local del servidor')
console.log('   npm run dev:seenode')
console.log('')
console.log('   # Verificar health check')
console.log('   curl http://localhost:3000/api/health')

// Generar archivo de configuración
const configFile = {
  project: projectInfo,
  seenode: seeNodeConfig,
  environment: {
    required: [
      'DATABASE_URL',
      'NODE_ENV'
    ],
    optional: [
      'CORS_ORIGIN',
      'PORT'
    ]
  },
  urls: {
    seenode: 'https://seenode.com',
    supabase: 'https://supabase.com',
    repository: 'https://github.com/ENEASJO/CONTROL-VALO',
    documentation: './SEENODE-DEPLOYMENT-GUIDE.md'
  }
}

fs.writeFileSync('seenode-deployment-config.json', JSON.stringify(configFile, null, 2))

console.log('\n📄 Configuración guardada en: seenode-deployment-config.json')

// Verificar estado del build
console.log('\n🧪 VERIFICANDO ESTADO DEL BUILD:')

if (fs.existsSync('frontend/dist')) {
  const distFiles = fs.readdirSync('frontend/dist')
  console.log(`   ✅ Frontend build: ${distFiles.length} archivos`)
} else {
  console.log('   ❌ Frontend build: No encontrado')
  console.log('   Ejecuta: npm run build:frontend:seenode')
}

if (fs.existsSync('backend/src/app.js')) {
  console.log('   ✅ Backend app: Configurado')
} else {
  console.log('   ❌ Backend app: No encontrado')
}

// Resumen final
console.log('\n🎯 RESUMEN:')
if (allFilesExist && fs.existsSync('frontend/dist')) {
  console.log('   ✅ Todo listo para deployment en SeeNode!')
  console.log('   📖 Sigue la guía: SEENODE-DEPLOYMENT-GUIDE.md')
  console.log('   🚀 Tiempo estimado de deployment: 15-30 minutos')
} else {
  console.log('   ⚠️  Faltan algunos archivos o configuraciones')
  console.log('   🔧 Ejecuta los comandos sugeridos arriba')
}

console.log('\n💡 PRÓXIMO PASO:')
console.log('   1. Ir a https://seenode.com')
console.log('   2. Crear cuenta y nuevo proyecto')
console.log('   3. Seguir SEENODE-DEPLOYMENT-GUIDE.md')

console.log('\n🎉 ¡Buena suerte con el deployment!')