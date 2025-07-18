# Despliegue en Render - TaskManager

Esta guía te ayudará a desplegar la aplicación TaskManager en Render.

## Configuración Rápida

### 1. Preparación del Repositorio

Asegúrate de que tu repositorio tenga la estructura correcta:
```
taskmanager/
├── package.json          # Configuración principal
├── render.yaml           # Configuración de Render
├── server/
│   ├── package.json      # Dependencias del servidor
│   ├── index.js          # Servidor Express
│   └── ...
└── client/
    ├── package.json      # Dependencias del cliente
    └── ...
```

### 2. Configuración en Render

#### Opción A: Usando render.yaml (Recomendado)
1. El archivo `render.yaml` ya está configurado en el proyecto
2. Conecta tu repositorio a Render
3. Render detectará automáticamente la configuración

#### Opción B: Configuración Manual
Si prefieres configurar manualmente:

1. **Crear Web Service**:
   - Tipo: Web Service
   - Repositorio: Tu repositorio GitHub
   - Rama: main

2. **Configuración de Build**:
   - Build Command: `npm install && cd server && npm install`
   - Start Command: `node server/index.js`

3. **Variables de Entorno**:
   ```
   NODE_ENV=production
   PORT=10000
   ```

### 3. Base de Datos PostgreSQL

#### Crear Base de Datos en Render:
1. Ve a Dashboard > New > PostgreSQL
2. Nombre: `taskmanager-db`
3. Database Name: `taskmanager`
4. User: `taskmanager`

#### Configurar Variables de Entorno:
Una vez creada la base de datos, agrega estas variables al Web Service:

```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=tu_secreto_jwt_muy_seguro_aqui
BCRYPT_ROUNDS=10
```

**Nota**: Render generará automáticamente la `DATABASE_URL` cuando conectes la base de datos.

### 4. Configuración del Servidor

El archivo `server/.env.example` muestra las variables necesarias:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=10

# Server
PORT=10000
NODE_ENV=production
```

### 5. Inicialización de la Base de Datos

Una vez desplegado, necesitas ejecutar el esquema de la base de datos:

1. Ve a tu Web Service en Render
2. Abre la Shell desde el dashboard
3. Ejecuta:
   ```bash
   cd server
   npm run db:setup
   ```

O manualmente:
```bash
psql $DATABASE_URL -f server/database/schema.sql
```

### 6. Verificación del Despliegue

Tu aplicación estará disponible en: `https://tu-app-name.onrender.com`

Endpoints de prueba:
- `GET /api/health` - Estado del servidor
- `GET /api/users` - Lista de usuarios
- `GET /api/activities` - Lista de actividades

## Solución de Problemas

### Error: Cannot find module 'express'
**Causa**: Las dependencias del servidor no se instalaron correctamente.

**Solución**:
1. Verifica que el Build Command sea: `npm install && cd server && npm install`
2. Asegúrate de que `server/package.json` tenga todas las dependencias
3. Redespliega la aplicación

### Error: Cannot connect to database
**Causa**: Variables de entorno de base de datos no configuradas.

**Solución**:
1. Verifica que `DATABASE_URL` esté configurada
2. Asegúrate de que la base de datos PostgreSQL esté ejecutándose
3. Verifica las credenciales de conexión

### Error: Port already in use
**Causa**: El puerto no está configurado correctamente.

**Solución**:
1. Asegúrate de que el servidor use `process.env.PORT`
2. Configura `PORT=10000` en las variables de entorno

## Configuración Avanzada

### Múltiples Servicios
Si quieres separar frontend y backend:

```yaml
services:
  - type: web
    name: taskmanager-api
    env: node
    buildCommand: cd server && npm install
    startCommand: node server/index.js
    
  - type: static
    name: taskmanager-frontend
    env: node
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: ./client/dist
```

### Variables de Entorno Adicionales
```yaml
envVars:
  - key: CORS_ORIGIN
    value: https://tu-frontend.onrender.com
  - key: RATE_LIMIT_WINDOW
    value: 900000
  - key: RATE_LIMIT_MAX
    value: 100
```

## Monitoreo y Logs

- **Logs**: Disponibles en el dashboard de Render
- **Métricas**: CPU, memoria y respuesta HTTP
- **Alertas**: Configurable para downtime y errores

## Costos

- **Web Service**: $7/mes por servicio
- **PostgreSQL**: $7/mes por base de datos
- **Ancho de banda**: 100GB gratis/mes

## Recursos Útiles

- [Documentación de Render](https://render.com/docs)
- [Guía de Node.js en Render](https://render.com/docs/deploy-node-express-app)
- [Configuración de PostgreSQL](https://render.com/docs/databases)

---

¿Necesitas ayuda adicional? Revisa los logs en el dashboard de Render o contacta al soporte técnico.