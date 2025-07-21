#!/usr/bin/env node

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
