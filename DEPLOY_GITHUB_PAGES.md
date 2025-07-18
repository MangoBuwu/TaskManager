# 🚀 Guía de Despliegue en GitHub Pages

Esta guía te ayudará a desplegar la aplicación TaskManager en GitHub Pages de forma automática.

## 📋 Requisitos Previos

1. **Cuenta de GitHub** activa
2. **Repositorio público** en GitHub (GitHub Pages gratis solo funciona con repos públicos)
3. **Permisos de escritura** en el repositorio

## 🔧 Configuración Inicial

### 1. Actualizar la configuración base

**IMPORTANTE**: Antes de hacer el push, actualiza el archivo `client/vite.config.ts`:

```typescript
export default defineConfig({
  base: '/nombre-de-tu-repositorio/', // ⚠️ CAMBIA ESTO
  // ... resto de la configuración
})
```

Reemplaza `nombre-de-tu-repositorio` con el nombre exacto de tu repositorio de GitHub.

**Ejemplo**: Si tu repositorio se llama `taskmanager-app`, debe ser:
```typescript
base: '/taskmanager-app/',
```

### 2. Estructura de archivos necesaria

Asegúrate de que estos archivos estén presentes:

```
tu-repositorio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # ✅ Workflow de despliegue
├── client/
│   ├── public/
│   │   ├── 404.html           # ✅ Manejo de SPA routing
│   │   └── manifest.json      # ✅ PWA manifest
│   ├── src/
│   │   └── services/
│   │       ├── api.ts         # ✅ Usando mock API
│   │       └── mockApi.ts     # ✅ Datos simulados
│   ├── index.html             # ✅ Con script SPA
│   └── vite.config.ts         # ✅ Con base correcta
└── README.md
```

## 🚀 Proceso de Despliegue

### Opción 1: Despliegue Automático (Recomendado)

1. **Hacer push a GitHub**:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

2. **Verificar el workflow**:
   - Ve a tu repositorio en GitHub
   - Haz clic en la pestaña "Actions"
   - Verifica que el workflow "Deploy to GitHub Pages" se ejecute correctamente

3. **Habilitar GitHub Pages**:
   - Ve a "Settings" → "Pages"
   - En "Source", selecciona "Deploy from a branch"
   - Selecciona la rama `gh-pages`
   - Haz clic en "Save"

### Opción 2: Despliegue Manual

Si prefieres hacer el despliegue manual:

```bash
# 1. Ir al directorio del cliente
cd client

# 2. Instalar dependencias
npm install

# 3. Construir la aplicación
npm run build

# 4. Desplegar manualmente (requiere gh-pages package)
npm install -g gh-pages
gh-pages -d dist
```

## 🌐 Acceso a la Aplicación

Una vez desplegada, tu aplicación estará disponible en:

```
https://tu-usuario.github.io/nombre-de-tu-repositorio/
```

**Ejemplo**: 
- Usuario: `johndoe`
- Repositorio: `taskmanager-app`
- URL: `https://johndoe.github.io/taskmanager-app/`

## 🔍 Verificación del Despliegue

### ✅ Checklist de Verificación

- [ ] La aplicación carga correctamente
- [ ] La navegación funciona (Dashboard, Asignaciones, etc.)
- [ ] Los datos mock se cargan
- [ ] La aplicación es responsive
- [ ] Se puede instalar como PWA
- [ ] Los datos se persisten en localStorage

### 🐛 Solución de Problemas

#### Problema: Página en blanco
**Solución**: Verifica que el `base` en `vite.config.ts` coincida exactamente con el nombre del repositorio.

#### Problema: 404 en rutas internas
**Solución**: Asegúrate de que el archivo `404.html` esté en `client/public/`.

#### Problema: Recursos no cargan
**Solución**: Verifica que todas las rutas de assets usen rutas relativas.

#### Problema: PWA no funciona
**Solución**: Verifica que el `manifest.json` esté accesible y correctamente configurado.

## 📱 Funcionalidades Disponibles

### ✅ Lo que funciona sin backend:
- ✅ Dashboard con métricas
- ✅ Gestión de asignaciones diarias
- ✅ Historial de actividades
- ✅ Reportes con barras de progreso
- ✅ CRUD de responsables
- ✅ CRUD de actividades
- ✅ CRUD de ubicaciones
- ✅ Persistencia en localStorage
- ✅ PWA instalable
- ✅ Diseño responsive

### ℹ️ Limitaciones:
- Los datos se almacenan solo en el navegador local
- No hay sincronización entre dispositivos
- Los datos se pierden si se limpia el navegador

## 🔄 Actualizaciones

Para actualizar la aplicación:

1. Haz los cambios necesarios
2. Commit y push a la rama `main`
3. El workflow se ejecutará automáticamente
4. La aplicación se actualizará en unos minutos

## 🎯 Comandos Útiles

```bash
# Desarrollo local
cd client && npm run dev

# Construcción local
cd client && npm run build

# Preview local del build
cd client && npm run preview

# Limpiar caché
cd client && rm -rf node_modules package-lock.json && npm install
```

## 📞 Soporte

Si tienes problemas con el despliegue:

1. **Verifica los logs** en la pestaña "Actions" de GitHub
2. **Revisa la configuración** del `base` en `vite.config.ts`
3. **Comprueba que GitHub Pages** esté habilitado en Settings
4. **Asegúrate** de que el repositorio sea público

---

¡Tu aplicación TaskManager estará lista para usar en GitHub Pages! 🎉