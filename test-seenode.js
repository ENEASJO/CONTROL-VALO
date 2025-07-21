#!/usr/bin/env node

/**
 * Script para probar la configuración de SeeNode localmente
 */

const express = require('express')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log('🧪 Iniciando test de configuración SeeNode...\n')

// Test 1: Verificar archivos necesarios para SeeNode
console.log('📋 Test 1: Verificando archivos SeeNode...')

async function testSeeNodeFiles() {
  try {
    const requiredFiles = [
      'server.js',
      'backend/src/app.js',
      'seenode.config.js',
      'package.json'
    ]
    
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Archivo faltante: ${file}`)
      }
      console.log(`   ✅ ${file} encontrado`)
    }
    
    // Verificar contenido de server.js
    const serverContent = fs.readFileSync('server.js', 'utf8')
    if (!serverContent.includes('express.static')) {
      throw new Error('server.js no está configurado para servir archivos estáticos')
    }
    
    if (!serverContent.includes('/api')) {
      throw new Error('server.js no tiene configuración de rutas API')
    }
    
    console.log('   ✅ server.js configurado correctamente')
    console.log('   ✅ Test 1 PASADO\n')
    
  } catch (error) {
    console.log(`   ❌ Test 1 FALLIDO: ${error.message}\n`)
    return false
  }
  return true
}

// Test 2: Verificar scripts de package.json
console.log('📋 Test 2: Verificando scripts de package.json...')

async function testPackageScripts() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    
    const requiredScripts = [
      'build:seenode',
      'start',
      'dev:seenode'
    ]
    
    for (const script of requiredScripts) {
      if (!packageJson.scripts[script]) {
        throw new Error(`Script faltante: ${script}`)
      }
      console.log(`   ✅ Script "${script}" encontrado`)
    }
    
    // Verificar engines
    if (!packageJson.engines || !packageJson.engines.node) {
      console.log('   ⚠️  Advertencia: engines.node no especificado')
    } else {
      console.log(`   ✅ Node version: ${packageJson.engines.node}`)
    }
    
    console.log('   ✅ Test 2 PASADO\n')
    
  } catch (error) {
    console.log(`   ❌ Test 2 FALLIDO: ${error.message}\n`)
    return false
  }
  return true
}

// Test 3: Verificar configuración de SeeNode
console.log('📋 Test 3: Verificando configuración SeeNode...')

async function testSeeNodeConfig() {
  try {
    const configPath = 'seenode.config.js'
    
    if (!fs.existsSync(configPath)) {
      throw new Error('seenode.config.js no encontrado')
    }
    
    // Intentar cargar la configuración
    delete require.cache[require.resolve('./seenode.config.js')]
    const config = require('./seenode.config.js')
    
    // Verificar estructura básica
    if (!config.server || !config.build || !config.start) {
      throw new Error('Configuración de seenode.config.js incompleta')
    }
    
    console.log(`   ✅ Puerto configurado: ${config.server.port}`)
    console.log(`   ✅ Comando build: ${config.build.command}`)
    console.log(`   ✅ Comando start: ${config.start.command}`)
    
    console.log('   ✅ Test 3 PASADO\n')
    
  } catch (error) {
    console.log(`   ❌ Test 3 FALLIDO: ${error.message}\n`)
    return false
  }
  return true
}

// Test 4: Verificar build para SeeNode
console.log('📋 Test 4: Verificando build SeeNode...')

async function testSeeNodeBuild() {
  try {
    // Verificar que el frontend se puede buildear
    const frontendPath = 'frontend/dist'
    
    console.log('   🔨 Verificando build del frontend...')
    
    if (!fs.existsSync('frontend/package.json')) {
      throw new Error('frontend/package.json no encontrado')
    }
    
    // Verificar que vite.config.ts existe y está configurado
    if (!fs.existsSync('frontend/vite.config.ts')) {
      throw new Error('frontend/vite.config.ts no encontrado')
    }
    
    const viteConfig = fs.readFileSync('frontend/vite.config.ts', 'utf8')
    if (!viteConfig.includes('outDir')) {
      throw new Error('vite.config.ts no tiene outDir configurado')
    }
    
    console.log('   ✅ Configuración de build del frontend válida')
    
    // Verificar backend
    console.log('   🔨 Verificando configuración del backend...')
    
    if (!fs.existsSync('backend/src/app.js')) {
      throw new Error('backend/src/app.js no encontrado')
    }
    
    const backendApp = fs.readFileSync('backend/src/app.js', 'utf8')
    if (!backendApp.includes('module.exports')) {
      throw new Error('backend/src/app.js no exporta la aplicación')
    }
    
    console.log('   ✅ Configuración del backend válida')
    console.log('   ✅ Test 4 PASADO\n')
    
  } catch (error) {
    console.log(`   ❌ Test 4 FALLIDO: ${error.message}\n`)
    return false
  }
  return true
}

// Test 5: Verificar variables de entorno
console.log('📋 Test 5: Verificando variables de entorno...')

async function testEnvironmentVars() {
  try {
    const requiredVars = ['DATABASE_URL']
    const optionalVars = ['NODE_ENV', 'CORS_ORIGIN', 'PORT']
    
    console.log('   📋 Variables requeridas:')
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        console.log(`   ⚠️  ${varName}: NO CONFIGURADA (requerida para producción)`)
      } else {
        console.log(`   ✅ ${varName}: CONFIGURADA`)
      }
    }
    
    console.log('   📋 Variables opcionales:')
    for (const varName of optionalVars) {
      if (!process.env[varName]) {
        console.log(`   ℹ️  ${varName}: No configurada (opcional)`)
      } else {
        console.log(`   ✅ ${varName}: ${process.env[varName]}`)
      }
    }
    
    console.log('   ✅ Test 5 PASADO\n')
    
  } catch (error) {
    console.log(`   ❌ Test 5 FALLIDO: ${error.message}\n`)
    return false
  }
  return true
}

// Ejecutar todos los tests
async function runAllTests() {
  console.log('🚀 Ejecutando todos los tests de SeeNode...\n')
  
  const test1 = await testSeeNodeFiles()
  const test2 = await testPackageScripts()
  const test3 = await testSeeNodeConfig()
  const test4 = await testSeeNodeBuild()
  const test5 = await testEnvironmentVars()
  
  console.log('📊 RESUMEN DE TESTS SEENODE:')
  console.log(`   Test 1 (Archivos SeeNode): ${test1 ? '✅ PASADO' : '❌ FALLIDO'}`)
  console.log(`   Test 2 (Scripts Package): ${test2 ? '✅ PASADO' : '❌ FALLIDO'}`)
  console.log(`   Test 3 (Config SeeNode): ${test3 ? '✅ PASADO' : '❌ FALLIDO'}`)
  console.log(`   Test 4 (Build Config): ${test4 ? '✅ PASADO' : '❌ FALLIDO'}`)
  console.log(`   Test 5 (Variables Entorno): ${test5 ? '✅ PASADO' : '❌ FALLIDO'}`)
  
  const allPassed = test1 && test2 && test3 && test4 && test5
  
  if (allPassed) {
    console.log('\n🎉 TODOS LOS TESTS PASARON - Configuración SeeNode lista!')
    console.log('\n📝 Próximos pasos para SeeNode:')
    console.log('   1. Crear cuenta en SeeNode.com')
    console.log('   2. Conectar repositorio GitHub')
    console.log('   3. Configurar variables de entorno')
    console.log('   4. Configurar build: npm run build:seenode')
    console.log('   5. Configurar start: npm start')
    console.log('   6. Deploy!')
    console.log('\n🧪 Para probar localmente:')
    console.log('   npm run dev:seenode')
  } else {
    console.log('\n❌ ALGUNOS TESTS FALLARON - Revisar configuración SeeNode')
  }
  
  return allPassed
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1)
  })
}

module.exports = { runAllTests }