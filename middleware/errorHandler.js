module.exports = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error no controlado:`, err)
  res.status(500).json({ error: 'Error interno del servidor' })
}
