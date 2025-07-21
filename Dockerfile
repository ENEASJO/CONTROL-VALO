# Dockerfile optimizado para SeeNode
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Instalar dependencias
RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build:seenode

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["npm", "start"]