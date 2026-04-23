const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Verifica conexión SMTP al iniciar (falla silenciosa, solo loguea)
transporter.verify((err) => {
  if (err) {
    console.error(`[${new Date().toISOString()}] SMTP no disponible:${err.message} -- ${process.env.SMTP_USER}` )
  } else {
    console.log(`[${new Date().toISOString()}] SMTP listo`)
  }
})

module.exports = transporter
