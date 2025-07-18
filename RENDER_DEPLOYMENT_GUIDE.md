# 🚀 Guía de Despliegue en Render - TaskManager

## 🐛 Problema Resuelto

**Error Original:**
```
Error: Cannot find module 'express'
Require stack:
- /opt/render/project/src/server/index.js
```

**Causa:** Render ejecutaba `yarn install` en la raíz pero las dependencias de Express estaban en `server/package.json`.

## ✅ Solución Implementada

### 1. Configuración de Archivos

#### `package.json` (Raíz)
```json
{
  "name": "taskmanager-app",
  "type": "module",
  "scripts": {
    "start": "node server/index.js",
    "postinstall": "cd server && npm install"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  }
}
```

#### `server/package.json`
```json
{
  "name": "taskmanager-server",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    // ... otras dependencias
  }
}
```

#### `render.yaml`
```yaml
services:
  - type: web
    name: taskmanager-api
    env: node
    buildCommand: ./install-render.sh
    startCommand: node server/index.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

### 2. Scripts de Instalación

#### `install-render.sh`
```bash
#!/bin/bash
echo "🚀 Installing TaskManager for Render deployment..."
npm install
cd server && npm install
echo "✅ Installation completed successfully!"
```

## 🚀 Instrucciones de Despliegue

### Opción 1: Configuración Automática (Recomendada)

1. **Sube todos los archivos a tu repositorio:**
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Conecta tu repositorio a Render:**
   - Ve a [Render Dashboard](https://dashboard.render.com)
   - Haz clic en "New" > "Web Service"
   - Conecta tu repositorio GitHub
   - Render detectará automáticamente el `render.yaml`

3. **Configura variables de entorno (opcional):**
   - `DATABASE_URL`: URL de tu base de datos PostgreSQL
   - `JWT_SECRET`: Secreto para JWT (Render puede generar uno automáticamente)

### Opción 2: Configuración Manual

1. **Crear Web Service:**
   - Build Command: `./install-render.sh`
   - Start Command: `node server/index.js`

2. **Variables de Entorno:**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=tu_url_de_base_de_datos
   JWT_SECRET=tu_secreto_jwt
   ```

## 🔧 Configuración de Base de Datos

### Crear PostgreSQL en Render

1. **Crear Database:**
   - Ve a Dashboard > New > PostgreSQL
   - Nombre: `taskmanager-db`
   - Database Name: `taskmanager`
   - User: `taskmanager`

2. **Conectar al Web Service:**
   - En tu Web Service, ve a Environment
   - Agrega: `DATABASE_URL` (conecta desde la database)

3. **Inicializar Schema:**
   - Una vez desplegado, abre la Shell del Web Service
   - Ejecuta: `psql $DATABASE_URL -f server/database/schema.sql`

## 📋 Verificación del Despliegue

### Endpoints de Prueba

1. **Health Check:**
   ```
   GET https://tu-app.onrender.com/health
   ```
   
   Respuesta esperada:
   ```json
   {
     "status": "OK",
     "timestamp": "2024-01-18T14:33:19.956Z",
     "env": "production",
     "port": 10000
   }
   ```

2. **API Info:**
   ```
   GET https://tu-app.onrender.com/api
   ```

3. **Endpoints de la API:**
   - `GET /api/users` - Lista de usuarios
   - `GET /api/activities` - Lista de actividades
   - `GET /api/locations` - Lista de ubicaciones
   - `GET /api/assignments` - Asignaciones
   - `GET /api/history` - Historial
   - `GET /api/dashboard` - Dashboard

## 🐛 Solución de Problemas

### Error: Cannot find module 'express'
**Solución:** Verifica que el `buildCommand` sea `./install-render.sh` y que el archivo tenga permisos de ejecución.

### Error: Permission denied
**Solución:** 
```bash
chmod +x install-render.sh
git add install-render.sh
git commit -m "Make install script executable"
git push origin main
```

### Error: Cannot connect to database
**Solución:**
1. Verifica que `DATABASE_URL` esté configurada
2. Asegúrate de que la base de datos PostgreSQL esté ejecutándose
3. Ejecuta el schema: `psql $DATABASE_URL -f server/database/schema.sql`

### Error: Module not found (ES modules)
**Solución:** Verifica que tanto el `package.json` raíz como el `server/package.json` tengan `"type": "module"`.

### Build falla en Render
**Solución:**
1. Verifica que todos los archivos estén en la rama `main`
2. Asegúrate de que `install-render.sh` tenga permisos de ejecución
3. Revisa los logs de build en Render Dashboard

## 🎯 Estructura Final del Proyecto

```
taskmanager/
├── package.json              # ✅ Configuración principal con ES modules
├── render.yaml               # ✅ Configuración de Render
├── install-render.sh         # ✅ Script de instalación personalizado
├── .npmrc                    # ✅ Configuración NPM optimizada
├── server/
│   ├── package.json          # ✅ Configuración del servidor con ES modules
│   ├── index.js              # ✅ Servidor Express con ES modules
│   └── ...
└── client/
    ├── package.json          # ✅ Configuración del cliente
    └── ...
```

## 🌟 Resultado Esperado

Con esta configuración, tu aplicación TaskManager debería:

- ✅ Instalarse correctamente en Render
- ✅ Ejecutarse sin errores de módulos
- ✅ Responder en todos los endpoints
- ✅ Conectarse a PostgreSQL (si está configurado)
- ✅ Funcionar en producción

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Render Dashboard
2. Verifica que todos los archivos estén en la rama `main`
3. Asegúrate de que las variables de entorno estén configuradas
4. Contacta al soporte de Render si el problema persiste

---

**¡Tu aplicación TaskManager está lista para producción!** 🎉