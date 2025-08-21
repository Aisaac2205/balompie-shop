# 🚀 Admin Dashboard - La Casa del Balompié

## 📋 Descripción General

El Admin Dashboard es un panel de administración completo y profesional para gestionar la tienda de camisolas de fútbol "La Casa del Balompié". Proporciona herramientas intuitivas para administrar productos, equipos, parches y configurar el sitio web.

## ✨ Características Principales

### 🎯 Gestión de Productos
- **CRUD Completo**: Crear, leer, actualizar y eliminar productos
- **Versiones Fan/Jugador**: Gestión de precios y características para ambas versiones
- **Upload de Imágenes**: Subida de imágenes con drag & drop
- **Gestión de Stock**: Control de inventario por tallas
- **Filtros Avanzados**: Búsqueda por nombre, equipo, competición, etc.

### 🏆 Gestión de Equipos
- **Información Completa**: Nombre, país, liga, año de fundación
- **Logros del Equipo**: Sistema de logros y títulos
- **Redes Sociales**: Enlaces a perfiles oficiales
- **Logos y Colores**: Gestión de identidad visual del equipo

### 🏷️ Gestión de Parches
- **Categorías**: Liga, Copa, Internacional, Especial, Personalizado
- **Sistema de Rareza**: Común, Raro, Épico, Legendario
- **Etiquetas**: Sistema de etiquetas para organización
- **Control de Stock**: Gestión de inventario

### ⚙️ Configuración del Sitio
- **Editor Visual**: Cambio de textos destacados (hero, banners)
- **Paleta de Colores**: Personalización completa de la identidad visual
- **Información de Contacto**: Email, teléfono, WhatsApp, dirección
- **Redes Sociales**: Configuración de perfiles sociales
- **SEO**: Metadatos, palabras clave, descripciones
- **Vista Previa**: Visualización en tiempo real de los cambios

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useMemo)
- **Routing**: React Router DOM
- **File Handling**: File API + Drag & Drop

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── admin/
│   │   └── AdminLayout.tsx          # Layout principal del admin
│   └── ui/
│       ├── image-upload.tsx         # Componente drag & drop
│       └── ...                      # Otros componentes UI
├── pages/
│   └── admin/
│       ├── Dashboard.tsx            # Panel principal
│       ├── Products.tsx             # Gestión de productos
│       ├── Teams.tsx                # Gestión de equipos
│       ├── Patches.tsx              # Gestión de parches
│       └── Settings.tsx             # Configuración del sitio
└── types/
    └── product.ts                   # Tipos de datos
```

## 🚀 Instalación y Uso

### 1. Instalación de Dependencias
```bash
npm install
# o
yarn install
```

### 2. Ejecutar en Desarrollo
```bash
npm run dev
# o
yarn dev
```

### 3. Acceder al Admin
```
http://localhost:5173/admin/login
```

## 📱 Funcionalidades por Página

### 🏠 Dashboard
- **Estadísticas en Tiempo Real**: Total de productos, stock disponible, alertas
- **Productos Recientes**: Lista de últimos productos agregados
- **Acciones Rápidas**: Enlaces directos a funciones principales
- **Estado del Sistema**: Indicadores de salud de la tienda

### 📦 Products
- **Formulario de Creación**: Campos completos para nuevos productos
- **Gestión de Versiones**: Precios y características Fan vs Jugador
- **Upload de Imágenes**: Drag & drop con validación
- **Filtros Avanzados**: Búsqueda y filtrado por múltiples criterios
- **Edición en Línea**: Modificación rápida de productos existentes

### 🏆 Teams
- **Información del Equipo**: Datos completos del club
- **Sistema de Logros**: Gestión de títulos y reconocimientos
- **Identidad Visual**: Logos y colores corporativos
- **Enlaces Externos**: Sitio web y redes sociales oficiales

### 🏷️ Patches
- **Categorización**: Organización por tipo y rareza
- **Sistema de Etiquetas**: Clasificación flexible
- **Control de Inventario**: Stock y disponibilidad
- **Gestión de Precios**: Precios por categoría

### ⚙️ Settings
- **Identidad de Marca**: Nombre, descripción, logos
- **Paleta de Colores**: Personalización completa del tema
- **Contenido Principal**: Textos del hero y secciones
- **Información de Contacto**: Datos del negocio
- **Configuración SEO**: Metadatos y palabras clave
- **Vista Previa**: Visualización de cambios antes de guardar

## 🎨 Sistema de Diseño

### Paleta de Colores
- **Primario**: #FFD100 (Amarillo)
- **Secundario**: #FFB800 (Amarillo Oscuro)
- **Acento**: #00A398 (Verde Azulado)
- **Fondo**: #141414 (Negro)
- **Texto**: #FFFFFF (Blanco)

### Componentes UI
- **Cards**: Contenedores principales con sombras y bordes
- **Buttons**: Botones con gradientes y estados hover
- **Inputs**: Campos de formulario con validación visual
- **Modals**: Diálogos para acciones importantes
- **Tabs**: Navegación por pestañas organizadas

## 🔒 Seguridad y Validación

### Validación de Datos
- **Campos Requeridos**: Validación de campos obligatorios
- **Tipos de Archivo**: Restricción a imágenes válidas
- **Tamaño de Archivo**: Límite de 5MB por imagen
- **Formato de Datos**: Validación de emails, URLs, etc.

### Estado de la Aplicación
- **Persistencia Local**: Guardado en localStorage
- **Control de Cambios**: Indicador de cambios sin guardar
- **Confirmaciones**: Diálogos de confirmación para acciones destructivas
- **Manejo de Errores**: Mensajes de error claros y útiles

## 📊 Gestión de Estado

### Estado Local
- **Productos**: Lista de productos con CRUD
- **Equipos**: Gestión de equipos del catálogo
- **Parches**: Inventario de parches disponibles
- **Configuración**: Ajustes del sitio web

### Persistencia
- **localStorage**: Almacenamiento temporal de cambios
- **Mock Data**: Datos de ejemplo para desarrollo
- **Preparado para API**: Estructura lista para integración con backend

## 🚀 Roadmap y Mejoras Futuras

### Funcionalidades Planificadas
- [ ] **Integración con Base de Datos**: Conexión a MongoDB/PostgreSQL
- [ ] **Sistema de Usuarios**: Roles y permisos avanzados
- [ ] **Analytics**: Métricas de ventas y comportamiento
- [ ] **Notificaciones**: Sistema de alertas en tiempo real
- [ ] **Backup Automático**: Respaldo automático de datos
- [ ] **API REST**: Endpoints para integración externa

### Mejoras de UX
- [ ] **Tutorial Interactivo**: Guía para nuevos usuarios
- [ ] **Atajos de Teclado**: Navegación rápida
- [ ] **Temas Personalizables**: Múltiples esquemas de color
- [ ] **Modo Oscuro/Claro**: Alternancia de temas
- [ ] **Responsive Avanzado**: Optimización para móviles

## 🐛 Solución de Problemas

### Problemas Comunes
1. **Imágenes no se cargan**: Verificar formato y tamaño del archivo
2. **Cambios no se guardan**: Revisar localStorage del navegador
3. **Errores de validación**: Completar todos los campos requeridos
4. **Problemas de rendimiento**: Limpiar caché del navegador

### Debug
- **Console Logs**: Información detallada en consola del navegador
- **React DevTools**: Inspección de componentes y estado
- **Network Tab**: Monitoreo de requests y respuestas

## 📞 Soporte y Contacto

### Desarrollador
- **Email**: [tu-email@ejemplo.com]
- **GitHub**: [tu-usuario-github]
- **LinkedIn**: [tu-perfil-linkedin]

### Documentación
- **Componentes**: [docs/components.md]
- **API**: [docs/api.md]
- **Deployment**: [docs/deployment.md]

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

**Desarrollado con ❤️ para La Casa del Balompié**

*Última actualización: Diciembre 2024*

