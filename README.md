# 🏪 BalompiéShop - Frontend

Tienda online de camisetas de fútbol construida con React, TypeScript y Vite.

![BalompiéShop](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-5-green) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)

## ✨ Características

- 🎨 **Interfaz Moderna**: Diseño responsive con TailwindCSS y shadcn/ui
- ⚽ **Catálogo de Productos**: Navegación por equipos y tipos de camisetas
- 🛒 **Carrito de Compras**: Sistema completo con personalización
- 📱 **Responsive Design**: Optimizado para móvil, tablet y desktop
- 🎯 **Hero Dinámico**: Carousel de imágenes administrable
- 🔄 **Estado Global**: Gestión con React hooks personalizados
- 📦 **WhatsApp Integration**: Checkout directo por WhatsApp

## 🚀 Tecnologías

### **Core:**
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server ultra-rápido

### **UI/UX:**
- **TailwindCSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes reutilizables
- **Radix UI** - Primitivos de UI accesibles
- **Lucide React** - Iconos SVG

### **Estado y Datos:**
- **TanStack Query** - Gestión de estado servidor
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de schemas

### **Routing y Navegación:**
- **React Router DOM** - Enrutamiento del lado cliente

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Aisaac2205/balompie-shop.git
cd balompie-shop

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run build:dev    # Build de desarrollo
npm run lint         # Ejecutar ESLint
npm run preview      # Previsualizar build
npm start           # Servidor de producción (Railway/Vercel)
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── admin/           # Panel de administración
│   ├── cart/            # Carrito y checkout
│   ├── layout/          # Componentes de layout
│   ├── product/         # Componentes de productos
│   ├── sections/        # Secciones de página
│   └── ui/              # Componentes UI base (shadcn)
├── hooks/               # Hooks personalizados
├── lib/                 # Utilidades y configuración
├── pages/               # Páginas de la aplicación
├── services/            # Servicios API
├── types/               # Definiciones de tipos TypeScript
└── utils/               # Funciones utilitarias
```

## 🎨 Componentes Principales

### **🏠 Páginas:**
- **Index** - Página principal con hero y productos destacados
- **Shop** - Catálogo completo con filtros
- **Teams** - Navegación por equipos
- **Admin** - Panel de administración

### **🛍️ Funcionalidades del Carrito:**
- Agregar/quitar productos
- Personalización (nombre, número)
- Selección de jugadores
- Checkout por WhatsApp

### **⚙️ Administración:**
- Gestión de productos
- Administración de equipos
- Gestión de jugadores
- Configuración de imágenes hero

## 🌐 Deployment

### **Vercel (Recomendado):**
```bash
# Conectar con Vercel CLI
npx vercel

# O subir directamente desde GitHub
```

### **Railway:**
```bash
# Railway se deployea automáticamente desde main
git push origin main
```

### **Variables de Entorno:**
```env
VITE_API_URL=https://tu-backend.railway.app/api
```

## 🎯 Características Destacadas

### **📱 Responsive Design:**
- Grid de productos: 2 columnas (móvil) → 4 columnas (desktop)
- Hero adaptativo con diferentes alturas
- Navegación móvil optimizada

### **🛒 Experiencia de Compra:**
- Carrito lateral deslizante
- Personalización avanzada de productos
- Integración directa con WhatsApp
- Formulario de checkout optimizado

### **⚡ Rendimiento:**
- Code splitting automático
- Lazy loading de componentes
- Optimización de imágenes
- Build optimizado con Vite

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **Aisaac2205** - *Desarrollo inicial* - [Aisaac2205](https://github.com/Aisaac2205)

## 🙏 Agradecimientos

- shadcn/ui por los componentes base
- Radix UI por los primitivos accesibles
- TailwindCSS por el sistema de diseño
- Vercel por el hosting gratuito

---

⚽ **¡Hecho con ❤️ para los amantes del fútbol!** ⚽