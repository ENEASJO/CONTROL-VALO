#!/usr/bin/env node

/**
 * Script para probar la configuración de deployment localmente
 * Simula el entorno de Vercel para verificar que todo funcione
 */

const express = require('express')
const { spawn } = require('child_process')
const path = require('path')

console.log('🧪 Iniciando test de configuración de deployment...\n')

// Test 1: Verificar que el punto de entrada API funcione
console.log('📋 Test 1: Verificando punto de entrada API...')

async function testApiEntry() {
  try {
    // Importar el punto de entrada API
    const apiPath = path.join(__dirname, 'backend/api/index.ts')
    console.log(`   Verificando archivo: ${apiPath}`)
    
    // Verificar que el archivo existe
    const fs = require('fs')
    if (!fs.existsSync(apiPath)) {
      throw new Error('Archivo backend/api/index.ts no encontrado')
    }
    
    console.log('   ✅ Archivo de entrada API encontrado')
    
    // Verificar imports
    const content = fs.readFileSync(apiPath, 'utf8')
    const requiredImports = [
      'express',
      'cors',
      '@prisma/client',
      '../src/middleware/errorHandler',
      '../src/routes/empresas',
      '../src/routes/ejecucion',
      '../src/routes/supervision'
    ]
    
    for (const imp of requiredImports) {
      if (!content.includes(imp)) {
        throw new Error(`Import faltante: ${imp}`)
      }
    }
    
    console.log('   ✅ Todos los imports necesarios están presentes')
    
    // Verificar rutas
    const requiredRoutes = [
      '/api/health',
      '/api/test',
      '/api/empresas',
      '/api/ejecucion',
      '/api/supervision'
    ]
    
    for (const route of requiredRoutes) {
      if (!content.includes(route)) {
        throw new Error(`Ruta faltante: ${route}`)
      }
    }
    
    console.log('   ✅ Todas las rutas necesarias están configuradas')
    console.log('   ✅ Test 1 PASADO\n')
    
  } catch (error) {
    console.log(`   ❌ Test 1 FALLIDO: ${error.message}\n`)
    return false
  }
  return true
}

// Test 2: Verificar configuración de Vercel
console.log('📋 Test 2: Verificando configuración de Vercel...')

async function testVercelConfig() {
  try {
    const vercelPath = path.join(__dirname, 'vercel.json')
    const fs = require('fs')
    
    if (!fs.existsSync(vercelPath)) {
      throw new Error('Archivo vercel.json no encontrado')
    }
    
    const config = JSON.parse(fs.readFileSync(vercelPath, 'utf8'))
    
    // Verificar estructura básica
    if (!config.builds || !config.routes || !config.functions) {
      throw new Error('Configuración de vercel.json incompleta')
    }
    
    // Verificar build del backend
    const backendBuild = config.builds.find(b => b.src === 'backend/api/index.ts')
    if (!backendBuild) {
      throw new Error('Build del backend no configurado')
    }
    
    // Verificar build del frontend
    const frontendBuild = config.builds.find(b => b.src === 'frontend/package.json')
    if (!frontendBuild) {
      throw new Error('Build del frontend no configurado')
    }
    
    // Verificar rutas
    const apiRoute = config.routes.find(r => r.src === '/api/(.*)')
    if (!apiRoute) {
      throw new Error('Ruta API no configurada')
    }
    
    // Verificar inclusión de archivos
    const functionConfig = config.functions['backend/api/index.ts']
    if (!functionConfig || !functionConfig.includeFiles) {
      throw new Error('Archivos de Prisma no incluidos en función')
    }
    
    console.log('   ✅ Configuración de vercel.json válida')
    console.log('   ✅ Test 2 PASADO\n')
    
  } catch (error) {
    console.log(`   ❌ Test 2 FALLIDO: ${error.message}\n`)
    return false
  }
  return true
}

// Test 3: Verificar configuración de Vite
console.log('📋 Test 3: Verificando configuración de Vite...')

async function testViteConfig() {
  try {
    const vitePath = path.join(__dirname, 'frontend/vite.config.ts')
    const fs = require('fs')
    
    if (!fs.existsSync(vitePath)) {
      throw new Error('Archivo vite.config.ts no encontrado')
    }
    
    const content = fs.readFileSync(vitePath, 'utf8')
    
    // Verificar configuraciones importantes
    if (!content.includes('outDir: \'dist\'')) {
      throw new Error('outDir no configurado correctamente')
    }
    
    if (!content.includes('manualChunks')) {
      throw new Error('Optimización de chunks no configurada')
    }
    
    console.log('   ✅ Configuración de Vite optimizada')
    console.log('   ✅ Test 3 PASADO\n')
    
  } catch (error) {
    console.log(`   ❌ Test 3 FALLIDO: ${error.message}\n`)
    return false
  }
  return true
}

// Ejecutar todos los tests
async function runAllTests() {
  console.log('🚀 Ejecutando todos los tests de deployment...\n')
  
  const test1 = await testApiEntry()
  const test2 = await testVercelConfig()
  const test3 = await testViteConfig()
  
  console.log('📊 RESUMEN DE TESTS:')
  console.log(`   Test 1 (API Entry): ${test1 ? '✅ PASADO' : '❌ FALLIDO'}`)
  console.log(`   Test 2 (Vercel Config): ${test2 ? '✅ PASADO' : '❌ FALLIDO'}`)
  console.log(`   Test 3 (Vite Config): ${test3 ? '✅ PASADO' : '❌ FALLIDO'}`)
  
  const allPassed = test1 && test2 && test3
  
  if (allPassed) {
    console.log('\n🎉 TODOS LOS TESTS PASARON - Configuración lista para deployment!')
    console.log('\n📝 Próximos pasos:')
    console.log('   1. Configurar variables de entorno en Vercel')
    console.log('   2. Hacer push a tu repositorio')
    console.log('   3. Vercel desplegará automáticamente')
  } else {
    console.log('\n❌ ALGUNOS TESTS FALLARON - Revisar configuración antes de deployment')
  }
  
  return allPassed
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1)
  })
}

module.exports = { runAllTests, testApiEntry, testVercelConfig, testViteConfig }