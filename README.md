# email-api — Guía de despliegue en cPanel

## Estructura del proyecto

```
email-api/
├── server.js                 ← entry point (apunta cPanel aquí)
├── app.js                    ← express + middlewares + rutas
├── package.json
├── .env                      ← NO subir a git
├── .env.example
├── middleware/
│   ├── cors.js
│   ├── rateLimiter.js
│   └── errorHandler.js
├── routes/
│   └── contacto.js
├── services/
│   └── mailer.js
├── schemas/
│   └── contacto.js
└── templates/
    └── contactoEmail.js
```

## Endpoints

| Método | Ruta                  | Descripción                          |
|--------|-----------------------|--------------------------------------|
| GET    | /contacto             | Health check                         |
| GET    | /contacto/getEmails   | Ver quién envía y recibe los correos |
| POST   | /contacto             | Enviar correo de contacto            |

---

## Paso a paso — cPanel Setup Node.js App

### 1. Subir archivos
- Entra a cPanel → **File Manager**
- Navega a la carpeta donde quieres alojar la app, por ejemplo: `/home/tuusuario/email-api/`
- Sube todos los archivos del proyecto (excepto `node_modules/` y `.env`)
- Crea el archivo `.env` directamente en el servidor copiando `.env.example` y rellenando los valores reales

### 2. Configurar la app en cPanel
- Entra a **Setup Node.js App**
- Haz clic en **Create Application**
- Completa el formulario:
  - **Node.js version**: la más reciente disponible (18+ recomendado)
  - **Application mode**: Production
  - **Application root**: `email-api` (la carpeta donde subiste los archivos)
  - **Application URL**: el subdominio o path donde correrá (ej: `eugedev.cl/api` o `api.eugedev.cl`)
  - **Application startup file**: `server.js`
- Haz clic en **Create**

### 3. Instalar dependencias
- En la misma pantalla de tu app, haz clic en **Run NPM Install**
- Espera a que termine (instala lo que está en package.json)

### 4. Variables de entorno
- En la pantalla de tu app, busca la sección **Environment Variables**
- Agrega cada variable de tu `.env`:
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_TO`, `CORS_ORIGINS`
- Guarda los cambios

> Alternativamente puedes crear el `.env` directo en File Manager, ambas formas funcionan.

### 5. Configurar .htaccess
Asegúrate de tener este `.htaccess` en la raíz del dominio:

```apache
<IfModule mod_headers.c>
  Header always set Access-Control-Allow-Origin "http://localhost:5173"
  Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS"
  Header always set Access-Control-Allow-Headers "Content-Type"
</IfModule>

RewriteEngine On

# Responder preflight OPTIONS sin pasar a Node
RewriteCond %{REQUEST_METHOD} OPTIONS
RewriteRule ^(.*)$ $1 [R=200,L]

# Redirigir /contacto a tu app Node
RewriteRule ^contacto(.*)$ http://127.0.0.1:PORT/contacto$1 [P,L]
```

Reemplaza `PORT` por el puerto que cPanel asignó a tu app (lo ves en la pantalla de Setup Node.js App).

### 6. Iniciar la app
- En **Setup Node.js App**, haz clic en **Start** (o **Restart** si ya estaba corriendo)
- Verifica que el status quede en **Running**

### 7. Verificar que funciona
```bash
# Health check
curl https://eugedev.cl/contacto

# Ver configuración de correos
curl https://eugedev.cl/contacto/getEmails

# Enviar correo de prueba
curl -X POST https://eugedev.cl/contacto \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@test.com","mensaje":"Mensaje de prueba largo"}'
```

---

## Troubleshooting

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| App se cae sola | Error no capturado | Revisar logs en cPanel → `Ver log` de la app |
| Cannot POST /contacto/ | Apache redirige con slash | El `.htaccess` con `RewriteRule ^contacto/$ /contacto` lo soluciona |
| Error CORS en preflight | Apache intercepta OPTIONS | Verificar bloque `RewriteCond OPTIONS` en `.htaccess` |
| SMTP no disponible al iniciar | Credenciales incorrectas o puerto bloqueado | Revisar variables de entorno y que el puerto 465 esté habilitado en el hosting |
