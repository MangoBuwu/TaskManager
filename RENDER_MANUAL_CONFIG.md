# 🚨 Configuración Manual para Render - URGENTE

## Problema Actual
Render está usando un commit antiguo (`f1facf8`) y no detecta el `render.yaml`. Necesitas actualizar la configuración manualmente.

## ✅ Solución Inmediata

### 1. Actualizar Configuración en Render Dashboard

Ve a tu Web Service en Render y actualiza:

#### **Build Command:**
```bash
yarn install && cd server && npm install
```

#### **Start Command:**
```bash
node server/index.js
```

#### **Variables de Entorno:**
```
NODE_ENV=production
PORT=10000
```

### 2. Forzar Redeploy

1. Ve a tu Web Service en Render
2. Haz clic en "Manual Deploy" 
3. Selecciona "Clear build cache & deploy"
4. Espera a que se complete

### 3. Verificar Branch y Commit

En la configuración de tu Web Service:
- **Branch**: `main`
- **Auto-Deploy**: `Yes`

## 🔧 Configuración Completa

### Build Settings:
```
Build Command: yarn install && cd server && npm install
Start Command: node server/index.js
```

### Environment Variables:
```
NODE_ENV=production
PORT=10000
```

### Opcionales (si tienes base de datos):
```
DATABASE_URL=tu_url_de_postgresql
JWT_SECRET=tu_secreto_jwt
BCRYPT_ROUNDS=10
```

## 📋 Pasos Detallados

### Paso 1: Ir a Render Dashboard
1. Ve a https://dashboard.render.com
2. Encuentra tu Web Service "TaskManager" o similar
3. Haz clic en él

### Paso 2: Actualizar Settings
1. Ve a la pestaña "Settings"
2. En "Build & Deploy":
   - **Build Command**: `yarn install && cd server && npm install`
   - **Start Command**: `node server/index.js`
3. Guarda los cambios

### Paso 3: Actualizar Environment
1. Ve a la pestaña "Environment"
2. Agrega/actualiza:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`

### Paso 4: Forzar Deploy
1. Ve a la pestaña "Manual Deploy"
2. Haz clic en "Clear build cache & deploy"
3. Espera 5-10 minutos

## 🎯 Resultado Esperado

Después de estos cambios, deberías ver:

```
🚀 TaskManager Server running!
📍 Port: 10000
🌍 Environment: production
🔗 Health check: http://localhost:10000/health
📚 API info: http://localhost:10000/api
```

## 🔍 Verificación

Una vez desplegado, prueba:
- `https://tu-app.onrender.com/health`
- `https://tu-app.onrender.com/api`

## 🐛 Si Sigue Fallando

### Opción 1: Crear Nuevo Web Service
1. Elimina el Web Service actual
2. Crea uno nuevo con la configuración correcta
3. Asegúrate de que esté usando la rama `main`

### Opción 2: Verificar Commit
1. En Settings, verifica que esté usando el commit más reciente
2. Si no, fuerza un redeploy

## 📞 Soporte

Si necesitas ayuda adicional:
1. Verifica que los cambios estén en GitHub
2. Asegúrate de que la rama sea `main`
3. Contacta al soporte de Render

---

**¡Sigue estos pasos y tu aplicación funcionará!** 🎉