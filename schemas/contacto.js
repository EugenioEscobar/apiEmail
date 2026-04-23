const { z } = require('zod')

const contactoSchema = z.object({
  nombre:  z.string().min(2),
  email:   z.string().email(),
  mensaje: z.string().min(10),
  empresa: z.string().optional(),
  website: z.string().optional(), // honeypot
})

module.exports = contactoSchema
