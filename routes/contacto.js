const express = require('express')
const router = express.Router()
const transporter = require('../services/mailer')
const contactoSchema = require('../schemas/contacto')
const buildEmailHTML = require('../templates/contactoEmail')

// GET /contacto → health check
router.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// GET /contacto/getEmails → quién envía y recibe
router.get('/getEmails', (req, res) => {
  res.json({
    from: process.env.SMTP_USER  || 'No configurado',
    to:   process.env.SMTP_TO   || 'No configurado',
  })
})

router.get('/getEnv',(req, res) => {
  res.json(process.env)
})

router.get('/debug', (req, res) => {
  res.json({
    origin: req.headers['origin'],
    host: req.headers['host'],
    referer: req.headers['referer'],
  })
})

// POST /contacto → envía correo
router.post('/', async (req, res, next) => {
  const { nombre, email, mensaje, empresa, website } = req.body

  // Honeypot
  if (website) {
    return res.status(400).json({ error: 'Spam detectado' })
  }

  const parsed = contactoSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Datos inválidos', detalles: parsed.error.flatten().fieldErrors })
  }

  try {
    await transporter.sendMail({
      from:    `"Web Contacto" <${process.env.SMTP_USER}>`,
      to:      process.env.SMTP_TO,
      subject: 'Nuevo mensaje de contacto',
      html:    buildEmailHTML({ nombre, email, mensaje, empresa }),
    })

    console.log(`[${new Date().toISOString()}] Email enviado desde ${email}`)
    return res.json({ message: 'Correo enviado de forma exitosa' })

  } catch (error) {
    // Pasa el error al middleware global — no tumba el proceso
    next(error)
  }
})

module.exports = router
