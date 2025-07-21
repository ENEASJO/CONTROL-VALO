#!/usr/bin/env node

/**
 * Script de emergencia para deployment en SeeNode
 * Crea la configuración más simple posible
 */

const fs = require('fs')

console.log('🚨 MODO EMERGENCIA - Creando deployment ultra-simple...\n')

// 1. Crear package.json mínimo
const minimalPackage = {
  "name": "control-valorizaciones-obras",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "build": "echo 'Building...' && cd frontend && npm install && npm run build:production",
    "start": "node server.js",
    "postinstall": "echo 'Installing dependencies...' && cd frontend && npm install && cd ../backend && npm install"
  },
  "engines": {
    "node": "18.x",
    "npm": ">=8.0.0"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "prisma": "^5.0.0"
  }
}

fs.writeFileSync('package-minimal.json', JSON.stringify(minimalPackage, null, 2))
console.log('✅ package-minimal.json creado')

// 2. Crear script de build súper simple
const simpleBuild = `#!/bin/bash
echo "🚀 Build súper simple iniciando..."

# Verificar Node
node --version
npm --version

# Instalar frontend
echo "📦 Frontend..."
cd frontend
npm install
npm run build:production
cd ..

echo "✅ Build completado!"
echo "📁 Archivos generados:"
ls -la frontend/dist/

echo "🎉 Listo para SeeNode!"
`

fs.writeFileSync('build-simple.sh', simpleBuild)
console.log('✅ build-simple.sh creado')

// 3. Crear server.js simplificado
const simpleServer = `const express = require('express')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

console.log('🚀 Iniciando servidor simple...')

// Middleware básico
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'frontend/dist')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString()
  })
})

// Servir frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🎉 Servidor corriendo en puerto \${PORT}\`)
})
`

fs.writeFileSync('server-simple.js', simpleServer)
console.log('✅ server-simple.js creado')

console.log('\n🎯 CONFIGURACIÓN DE EMERGENCIA PARA SEENODE:')
console.log('   Build Command: bash build-simple.sh')
console.log('   Start Command: node server-simple.js')
console.log('   Install Command: npm install')
console.log('   Node Version: 18.x')

console.log('\n📋 ARCHIVOS CREADOS:')
console.log('   - package-minimal.json (reemplazar package.json si es necesario)')
console.log('   - build-simple.sh (script de build ultra-simple)')
console.log('   - server-simple.js (servidor mínimo)')

console.log('\n🚨 INSTRUCCIONES DE EMERGENCIA:')
console.log('   1. Si el build actual falla, usar: bash build-simple.sh')
console.log('   2. Si el server falla, usar: node server-simple.js')
console.log('   3. Si todo falla, reemplazar package.json con package-minimal.json')

console.log('\n✅ Configuración de emergencia lista!')