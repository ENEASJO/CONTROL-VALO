const express = require('express')
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
  console.log(`🎉 Servidor corriendo en puerto ${PORT}`)
})
