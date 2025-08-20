# Panel de Administración - Jersey Realm

## 🚀 Características Implementadas

### ✅ Sistema de Autenticación
- Login seguro con email y contraseña
- Protección de rutas del panel de administración
- Sesiones persistentes con Zustand
- Logout automático

### ✅ Panel de Control Principal
- Dashboard con estadísticas en tiempo real
- Vista general de productos, stock y estado
- Acciones rápidas para gestión

### ✅ Gestión de Productos
- CRUD completo de productos
- Subida de imágenes
- Filtros y búsqueda avanzada
- Gestión de stock por tallas

### ✅ Integración con Base de Datos Real
- API service preparado para conexión real
- Estados vacíos cuando no hay datos
- Manejo de errores de conexión
- React Query para caché y sincronización

## 🔐 Acceso al Panel

### Credenciales de Desarrollo
- **Email:** admin@jerseyrealm.com
- **Contraseña:** admin123
- **URL:** `/admin/login`

### Rutas del Panel
- `/admin/dashboard` - Dashboard principal
- `/admin/products` - Gestión de productos
- `/admin/teams` - Gestión de equipos (próximamente)
- `/admin/patches` - Gestión de parches (próximamente)
- `/admin/users` - Gestión de usuarios (próximamente)
- `/admin/settings` - Configuración (próximamente)

## 🛠️ Configuración

### 1. Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Admin Authentication
VITE_ADMIN_EMAIL=admin@jerseyrealm.com
VITE_ADMIN_PASSWORD=admin123
```

### 2. Dependencias Instaladas
```bash
npm install zustand @tanstack/react-query
```

## 📊 Funcionalidades del Administrador

### Gestión de Productos
- **Crear:** Agregar nuevas camisolas con imágenes
- **Editar:** Modificar información existente
- **Eliminar:** Remover productos del catálogo
- **Filtrar:** Buscar por nombre, equipo, competencia
- **Ordenar:** Por precio, rating, nombre

### Gestión de Imágenes
- Subida de imágenes de productos
- Vista previa antes de guardar
- Soporte para múltiples formatos

### Gestión de Equipos
- Crear nuevos equipos
- Subir logos de equipos
- Asociar productos a equipos

## 🔒 Seguridad

### Protección de Rutas
- Todas las rutas `/admin/*` están protegidas
- Redirección automática a login si no autenticado
- Tokens JWT para sesiones (implementación futura)

### Autenticación
- Validación de credenciales
- Sesiones persistentes
- Logout seguro

## 🚧 Próximas Funcionalidades

### Gestión de Equipos
- [ ] CRUD de equipos
- [ ] Subida de logos
- [ ] Asociación con productos

### Gestión de Parches
- [ ] CRUD de parches
- [ ] Subida de imágenes
- [ ] Precios y disponibilidad

### Gestión de Usuarios
- [ ] Roles de administrador
- [ ] Permisos por sección
- [ ] Auditoría de acciones

### Configuración
- [ ] Configuración de la tienda
- [ ] Configuración de pagos
- [ ] Configuración de envíos

## 🗄️ Integración con Base de Datos

### API Service
El panel está preparado para conectarse a una base de datos real a través de:

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

### Endpoints Preparados
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PATCH /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto
- `POST /api/upload` - Subir imágenes
- `GET /api/teams` - Listar equipos
- `GET /api/patches` - Listar parches

### Estados Vacíos
Cuando no hay conexión a la base de datos, el panel muestra:
- Estados de carga apropiados
- Mensajes informativos
- Botones de acción para agregar contenido

## 🎯 Uso del Panel

### 1. Acceder al Panel
- Navega a `/admin/login`
- Ingresa las credenciales
- Serás redirigido al dashboard

### 2. Agregar Producto
- Ve a "Productos" en el sidebar
- Haz clic en "Agregar Producto"
- Completa el formulario
- Sube una imagen
- Guarda el producto

### 3. Gestionar Productos Existentes
- Usa los filtros para encontrar productos
- Haz clic en el botón de editar (lápiz)
- Modifica la información
- Guarda los cambios

### 4. Eliminar Productos
- Haz clic en el botón de eliminar (basura)
- Confirma la acción
- El producto se elimina del catálogo

## 🚀 Desarrollo

### Estructura de Archivos
```
src/
├── components/admin/
│   └── AdminLayout.tsx
├── pages/admin/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── Products.tsx
├── hooks/
│   ├── use-auth.tsx
│   └── use-products.tsx
├── services/
│   └── api.ts
└── types/
    └── auth.ts
```

### Tecnologías Utilizadas
- **React 18** con TypeScript
- **React Router** para navegación
- **Zustand** para estado global
- **React Query** para caché de datos
- **Tailwind CSS** para estilos
- **Shadcn/ui** para componentes

### Estado de la Aplicación
- **Autenticación:** Implementado
- **Dashboard:** Implementado
- **Productos:** Implementado
- **Equipos:** Preparado (UI lista)
- **Parches:** Preparado (UI lista)
- **Usuarios:** Preparado (UI lista)
- **Configuración:** Preparado (UI lista)

## 🔧 Solución de Problemas

### Error de Autenticación
- Verifica las credenciales
- Limpia el localStorage del navegador
- Reinicia la aplicación

### Productos No Cargados
- Verifica la conexión a la API
- Revisa la consola del navegador
- Verifica las variables de entorno

### Imágenes No Se Suben
- Verifica el endpoint de upload
- Revisa los permisos de archivos
- Verifica el formato de imagen

## 📞 Soporte

Para soporte técnico o preguntas sobre el panel de administración:

1. Revisa este README
2. Verifica la consola del navegador
3. Revisa los logs del servidor
4. Contacta al equipo de desarrollo

---

**Nota:** Este panel está diseñado para ser completamente funcional sin necesidad de modificar código. Solo necesitas configurar la base de datos y las variables de entorno cuando estén listas.

