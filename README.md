# TaskManager - Gestión de Actividades Diarias

Una aplicación web progresiva (PWA) para la gestión de actividades diarias con asignación de responsables y seguimiento por ubicaciones.

## 🚀 Características

### Funcionalidades Principales
- **Dashboard Interactivo**: Visualización en tiempo real del progreso diario
- **Asignaciones Diarias**: Gestión de tareas por responsable, actividad y ubicación
- **Historial Completo**: Seguimiento detallado de todas las actividades realizadas
- **Reportes Avanzados**: Barras de progreso por ubicación y estadísticas mensuales
- **Gestión de Responsables**: CRUD completo de usuarios con perfiles detallados
- **Registro de Ausencias**: Control de ausencias con motivos

### Características Técnicas
- **PWA**: Instalable en dispositivos móviles y desktop
- **Responsive Design**: Optimizado para todos los tamaños de pantalla
- **API REST**: Backend completo con Express.js
- **Base de Datos**: PostgreSQL con esquema optimizado
- **Modern UI**: Diseño minimalista estilo startup

## 🛠️ Tecnologías

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Vite** como bundler
- **React Router** para navegación
- **Lucide React** para iconos
- **Date-fns** para manejo de fechas
- **React Hot Toast** para notificaciones

### Backend
- **Node.js 18+** con Express.js
- **PostgreSQL** como base de datos
- **ES Modules** para sintaxis moderna
- **CORS** y **Helmet** para seguridad
- **Rate Limiting** para protección

### PWA
- **Service Worker** para cache offline
- **Web App Manifest** para instalación
- **Workbox** para estrategias de cache

## 📦 Instalación Rápida

### Opción 1: Script Automático (Recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd taskmanager-app

# Ejecutar script de instalación
./setup.sh
```

### Opción 2: Instalación Manual

#### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

#### Pasos

1. **Instalar dependencias**
```bash
npm run install-all
```

2. **Configurar variables de entorno**
```bash
cp server/.env.example server/.env
# Editar server/.env con tus credenciales de PostgreSQL
```

3. **Configurar base de datos**
```bash
# Crear base de datos
createdb taskmanager

# Ejecutar esquema
psql -d taskmanager -f server/database/schema.sql
```

4. **Ejecutar la aplicación**
```bash
# Desarrollo (frontend + backend)
npm run dev

# Solo backend
npm run server:dev

# Solo frontend
npm run client:dev
```

## 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Health**: http://localhost:5000/health
- **API Info**: http://localhost:5000/api

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Ejecuta frontend + backend
npm run server:dev       # Solo servidor backend
npm run client:dev       # Solo cliente frontend

# Producción
npm run build            # Construye el frontend
npm start               # Inicia servidor de producción
npm run server          # Solo servidor backend

# Utilidades
npm run install-all     # Instala todas las dependencias
npm run setup           # Alias para install-all
npm run clean           # Limpia node_modules

# Base de datos
cd server && npm run db:setup   # Configura la base de datos
cd server && npm run db:reset   # Resetea la base de datos
```

## 🏗️ Estructura del Proyecto

```
taskmanager-app/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # Servicios API
│   │   ├── types/          # Tipos TypeScript
│   │   └── main.tsx        # Punto de entrada
│   ├── public/             # Archivos estáticos
│   └── package.json
├── server/                 # Backend Node.js
│   ├── routes/             # Rutas API
│   ├── config/             # Configuración
│   ├── database/           # Esquemas SQL
│   └── index.js            # Servidor principal
├── .github/workflows/      # GitHub Actions
├── setup.sh               # Script de instalación
└── package.json           # Configuración raíz
```

## 📱 Funcionalidades Detalladas

### Dashboard
- Métricas en tiempo real del día actual
- Progreso de completación por actividad
- Rendimiento por responsable
- Indicadores de ausencias

### Asignaciones
- Crear/editar/eliminar asignaciones diarias
- Asignación por responsable, actividad y ubicación
- Marcar como completado con timestamp
- Registro de ausencias con motivos

### Historial
- Visualización cronológica de actividades
- Filtros avanzados por fecha, responsable, actividad
- Historial detallado por usuario
- Registro de ausencias integrado

### Reportes
- **Progreso por Ubicación**: Barras de progreso mostrando el estado de cada ubicación
- **Estadísticas Mensuales**: Métricas consolidadas por mes
- **Distribución por Actividad**: Análisis de frecuencia de actividades
- **Rendimiento por Responsable**: Métricas de productividad

### Gestión
- **Responsables**: CRUD completo con perfiles detallados
- **Actividades**: Gestión de tipos de actividad (con/sin ubicación)
- **Ubicaciones**: Organización por áreas (A01-F03)

## 🎯 Actividades Predefinidas

- **Guadaña**: Corte de césped y maleza
- **Riego**: Riego de plantas y jardines  
- **Barrido**: Limpieza y barrido de áreas
- **Servicios**: Servicios generales (sin ubicación específica)

## 📍 Ubicaciones

Sistema de códigos por áreas:
- **Área A**: A01 - A16 (16 ubicaciones)
- **Área B**: B01 - B08 (8 ubicaciones)
- **Área C**: C01 - C05 (5 ubicaciones)
- **Área D**: D01 - D04 (4 ubicaciones)
- **Área E**: E01 - E02 (2 ubicaciones)
- **Área F**: F01 - F03 (3 ubicaciones)

**Total**: 38 ubicaciones

## 🔄 Flujo de Trabajo

1. **Asignación Diaria**: Crear tareas para el día actual
2. **Ejecución**: Responsables marcan tareas como completadas
3. **Seguimiento**: Monitoreo en tiempo real desde el dashboard
4. **Archivo**: Al final del día, las tareas se archivan en el historial
5. **Reportes**: Análisis de progreso y rendimiento

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### GitHub Pages (Solo Frontend)
Ver `DEPLOY_GITHUB_PAGES.md` para instrucciones detalladas.

### Docker (Próximamente)
```bash
docker-compose up -d
```

## 🔧 Configuración

### Variables de Entorno (server/.env)
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Base de Datos
La aplicación creará automáticamente:
- 4 actividades predefinidas
- 38 ubicaciones organizadas por áreas
- 4 usuarios de ejemplo
- Índices optimizados para consultas

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verificar que PostgreSQL esté ejecutándose
- Comprobar credenciales en `server/.env`
- Asegurarse de que la base de datos `taskmanager` existe

### Puerto ocupado
- Cambiar puertos en `server/.env` y `client/vite.config.ts`
- Verificar que los puertos 3000 y 5000 estén disponibles

### Dependencias
```bash
# Limpiar e instalar de nuevo
npm run clean
npm run install-all
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🐛 Soporte

Para reportar bugs o solicitar funcionalidades:
1. Crear un issue en el repositorio
2. Incluir información del sistema y pasos para reproducir
3. Adjuntar logs relevantes

## 📞 Contacto

Para soporte técnico o consultas, crear un issue en el repositorio.

---

**TaskManager** - Gestión eficiente de actividades diarias 🎯