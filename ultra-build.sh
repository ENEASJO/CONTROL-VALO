#!/bin/bash
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
