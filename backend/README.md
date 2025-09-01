# Backend - La Casa del Balompié

## 🚀 Descripción

Backend API para la tienda de camisolas de fútbol "La Casa del Balompié". Proporciona endpoints para gestión de productos, equipos, autenticación y upload de imágenes.

## 🛠️ Tecnologías

- **Node.js** + **Express**
- **PostgreSQL** (base de datos)
- **JWT** (autenticación)
- **Cloudinary** (almacenamiento de imágenes)
- **Multer** (manejo de archivos)

## 📁 Estructura

```
backend/
├── config/
│   └── database.js          # Configuración de PostgreSQL
├── routes/
│   ├── products.js          # CRUD de productos
│   ├── teams.js             # CRUD de equipos
│   ├── auth.js              # Autenticación
│   └── upload.js             # Upload de imágenes
├── server.js                 # Servidor principal
├── package.json             # Dependencias
└── env.example              # Variables de entorno
```

## 🚀 Instalación

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
```bash
cp env.example .env
# Editar .env con tus credenciales
```

### 3. Configurar base de datos
- Crear base de datos PostgreSQL
- Configurar `DATABASE_URL` en `.env`
- Las tablas se crean automáticamente

### 4. Configurar Cloudinary
- Crear cuenta en Cloudinary
- Configurar credenciales en `.env`

### 5. Ejecutar servidor
```bash
npm run dev    # Desarrollo
npm start      # Producción
```

## 📡 Endpoints

### 🔐 Autenticación
- `POST /api/auth/login` - Login de admin
- `POST /api/auth/register` - Registrar admin
- `GET /api/auth/me` - Obtener usuario actual

### 📦 Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### 🏆 Equipos
- `GET /api/teams` - Listar equipos
- `GET /api/teams/:id` - Obtener equipo
- `POST /api/teams` - Crear equipo
- `PUT /api/teams/:id` - Actualizar equipo
- `DELETE /api/teams/:id` - Eliminar equipo

### 📸 Upload
- `POST /api/upload/image` - Subir imagen
- `POST /api/upload/multiple` - Subir múltiples imágenes
- `DELETE /api/upload/:publicId` - Eliminar imagen

## 🔧 Variables de Entorno

```env
# Base de datos
DATABASE_URL=postgresql://user:pass@host:port/db

# JWT
JWT_SECRET=your-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend
FRONTEND_URL=http://localhost:5173

# Servidor
PORT=5000
NODE_ENV=development
```

## 🗄️ Base de Datos

### Tabla: products
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  team VARCHAR(100) NOT NULL,
  equipment_type VARCHAR(50) NOT NULL,
  product_type VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  player_price DECIMAL(10,2),
  description TEXT,
  images TEXT[],
  sizes VARCHAR(10)[],
  primary_color VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: teams
```sql
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  country VARCHAR(100),
  league VARCHAR(100),
  founded_year INTEGER,
  achievements TEXT[],
  social_media JSONB,
  logo_url VARCHAR(255),
  primary_color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabla: admin_users
```sql
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

## 🔒 Seguridad

- **Helmet** para headers de seguridad
- **Rate limiting** para prevenir spam
- **CORS** configurado
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas

## 🚀 Despliegue

### Railway
1. Conectar repositorio
2. Configurar variables de entorno
3. Agregar servicio PostgreSQL
4. Deploy automático

### Variables de producción
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=production-secret-key
FRONTEND_URL=https://your-frontend-url.com
```
