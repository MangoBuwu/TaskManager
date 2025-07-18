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
- **Offline Support**: Funciona sin conexión a internet
- **Real-time Updates**: Actualizaciones en tiempo real
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
- **Node.js** con Express
- **PostgreSQL** como base de datos
- **JWT** para autenticación
- **CORS** y **Helmet** para seguridad
- **Rate Limiting** para protección

### PWA
- **Service Worker** para cache offline
- **Web App Manifest** para instalación
- **Workbox** para estrategias de cache

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

### Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd taskmanager-app
```

2. **Instalar dependencias**
```bash
npm run install-all
```

3. **Configurar base de datos**
```bash
# Crear base de datos PostgreSQL
createdb taskmanager

# Ejecutar el esquema
psql -d taskmanager -f server/database/schema.sql
```

4. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp server/.env.example server/.env

# Editar con tus datos
nano server/.env
```

5. **Ejecutar la aplicación**
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
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
└── package.json            # Configuración raíz
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

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

### Docker (Opcional)
```bash
docker-compose up -d
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

Para reportar bugs o solicitar funcionalidades, crear un issue en el repositorio.

---

**TaskManager** - Gestión eficiente de actividades diarias 🎯