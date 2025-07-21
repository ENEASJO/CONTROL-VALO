#!/usr/bin/env node

/**
 * Script para diagnosticar y arreglar problemas de deployment en SeeNode
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 Diagnosticando problemas de deployment SeeNode...\n')

// Problemas comunes y sus soluciones
const commonIssues = [
  {
    issue: 'TypeScript not found',
    solution: 'Instalar TypeScript globalmente',
    fix: () => {
      console.log('📦 Agregando TypeScript como dependencia...')
      // Ya lo agregamos en package.json
      return true
    }
  },
  {
    issue: 'Build command fails',
    solution: 'Simplificar comando de build',
    fix: () => {
      console.log('🔨 Simplificando comando de build...')
      return true
    }
  },
  {
    issue: 'Dependencies not installed',
    solution: 'Mejorar script de instalación',
    fix: () => {
      console.log('📦 Optimizando instalación de dependencias...')
      return true
    }
  },
  {
    issue: 'Frontend build fails',
    solution: 'Usar build más permisivo',
    fix: () => {
      console.log('🎨 Configurando build permisivo del frontend...')
      return true
    }
  }
]

// Crear package.json simplificado para SeeNode
function createSimplifiedBuild() {
  console.log('📋 Creando configuración simplificada para SeeNode...')
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  
  // Simplificar scripts
  packageJson.scripts['build:simple'] = 'cd frontend && npm install && npm run build:production'
  packageJson.scripts['build'] = 'npm run build:simple'
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2))
  console.log('✅ package.json actualizado')
}

// Crear script de build ultra-simple
function createUltraSimpleBuild() {
  console.log('🛠️ Creando script de build ultra-simple...')
  
  const buildScript = `#!/bin/bash
set -e

echo "🚀 Ultra-simple build para SeeNode"

# Instalar dependencias del frontend
echo "📦 Instalando frontend..."
cd frontend
npm install --production=false
echo "🔨 Building frontend..."
npm run build:production
cd ..

echo "✅ Build completado!"
ls -la frontend/dist/
`

  fs.writeFileSync('ultra-build.sh', buildScript)
  console.log('✅ ultra-build.sh creado')
}

// Crear configuración de emergencia
function createEmergencyConfig() {
  console.log('🚨 Creando configuración de emergencia...')
  
  const emergencyPackage = {
    "name": "control-valorizaciones-obras",
    "version": "1.0.0",
    "scripts": {
      "build": "cd frontend && npm install && npm run build:production",
      "start": "node server.js",
      "postinstall": "cd frontend && npm install && cd ../backend && npm install"
    },
    "engines": {
      "node": "18.x"
    },
    "dependencies": {
      "express": "^4.18.0",
      "cors": "^2.8.5"
    },
    "devDependencies": {
      "typescript": "^5.0.0"
    }
  }
  
  fs.writeFileSync('package-emergency.json', JSON.stringify(emergencyPackage, null, 2))
  console.log('✅ package-emergency.json creado')
}

// Ejecutar diagnóstico
console.log('🔍 DIAGNÓSTICO COMPLETO:\n')

// Verificar archivos críticos
const criticalFiles = [
  'server.js',
  'frontend/package.json',
  'frontend/dist/index.html'
]

console.log('📁 Verificando archivos críticos:')
for (const file of criticalFiles) {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`)
  } else {
    console.log(`   ❌ ${file} - FALTANTE`)
  }
}

// Crear fixes
console.log('\n🔧 APLICANDO FIXES:')
createSimplifiedBuild()
createUltraSimpleBuild()
createEmergencyConfig()

console.log('\n📋 CONFIGURACIONES ALTERNATIVAS CREADAS:')
console.log('   1. package.json - Simplificado')
console.log('   2. ultra-build.sh - Script ultra-simple')
console.log('   3. package-emergency.json - Configuración mínima')

console.log('\n🎯 PRÓXIMOS PASOS:')
console.log('   1. Revisar logs detallados de SeeNode')
console.log('   2. Si build falla, usar: build: bash ultra-build.sh')
console.log('   3. Si persiste, reemplazar package.json con package-emergency.json')
console.log('   4. Verificar variables de entorno en SeeNode')

console.log('\n📞 CONFIGURACIÓN RECOMENDADA PARA SEENODE:')
console.log('   Build Command: npm run build')
console.log('   Start Command: npm start')
console.log('   Install Command: npm install')
console.log('   Node Version: 18.x')

console.log('\n🚨 SI EL PROBLEMA PERSISTE:')
console.log('   - Cambiar Build Command a: bash ultra-build.sh')
console.log('   - O usar configuración de emergencia')

console.log('\n✅ Diagnóstico completado!')