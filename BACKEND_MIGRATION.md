# Script para mover el backend al nuevo repositorio

## 🚀 Pasos para separar el backend:

### 1. Crear nuevo repositorio
```bash
# Ya creado: https://github.com/Aisaac2205/backend_balompie
```

### 2. Clonar el nuevo repositorio
```bash
git clone https://github.com/Aisaac2205/backend_balompie.git
cd backend_balompie
```

### 3. Copiar archivos del backend
```bash
# Copiar desde el proyecto actual
cp -r ../balompie-shop-1/backend/* .
```

### 4. Crear .env para el backend
```env
# Variables de entorno para Railway

# Base de datos PostgreSQL (Railway)
DATABASE_URL=postgresql://postgres:STEvrkxsIShqWMRFwTpfZXBtZDsHKsyo@postgres.railway.internal:5432/railway

# JWT Secret para autenticación
JWT_SECRET=balompie-shop-super-secret-jwt-key-2024

# Cloudinary para almacenamiento de imágenes
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# URL del frontend (Railway)
FRONTEND_URL=https://balompie-shop-production.up.railway.app

# Puerto del servidor
PORT=5000

# Entorno
NODE_ENV=production
```

### 5. Hacer commit y push
```bash
git add .
git commit -m "Backend inicial con API REST, PostgreSQL y autenticación JWT"
git push origin main
```

### 6. Configurar en Railway
1. Crear nuevo proyecto en Railway
2. Conectar con el repositorio backend_balompie
3. Agregar servicio PostgreSQL
4. Configurar variables de entorno
5. Deploy automático

### 7. Actualizar frontend
Una vez que el backend esté desplegado, actualizar la URL en el frontend:
```env
VITE_API_URL=https://backend-balompie-production.up.railway.app
```

## 📁 Estructura del nuevo repositorio backend:

```
backend_balompie/
├── config/
│   └── database.js
├── routes/
│   ├── products.js
│   ├── teams.js
│   ├── auth.js
│   └── upload.js
├── scripts/
│   └── init-db.js
├── server.js
├── package.json
├── railway.toml
├── README.md
└── .env
```

## 🎯 Resultado final:

- ✅ Backend separado en su propio repositorio
- ✅ Frontend con variables de entorno configuradas
- ✅ Mejor organización y escalabilidad
- ✅ Despliegues independientes
- ✅ Mantenimiento más fácil
