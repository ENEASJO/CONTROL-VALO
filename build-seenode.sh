#!/bin/bash

# Script de build robusto para SeeNode
echo "🚀 Iniciando build para SeeNode..."

# Verificar Node version
echo "📋 Node version: $(node --version)"
echo "📋 NPM version: $(npm --version)"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

echo "📦 Instalando dependencias del frontend..."
cd frontend && npm install
cd ..

echo "📦 Instalando dependencias del backend..."
cd backend && npm install
cd ..

# Build del frontend
echo "🔨 Building frontend..."
cd frontend
npm run build:production
cd ..

echo "✅ Build completado exitosamente!"
echo "📁 Archivos generados en frontend/dist/"
ls -la frontend/dist/

echo "🎉 Listo para deployment!"