#!/bin/bash
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
