const app = require('./app')

// Captura errores no manejados para evitar caídas del proceso
process.on('uncaughtException', (err) => {
  console.error(`[${new Date().toISOString()}] uncaughtException:`, err)
})

process.on('unhandledRejection', (reason) => {
  console.error(`[${new Date().toISOString()}] unhandledRejection:`, reason)
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Servidor corriendo en puerto ${PORT}`)
})
