# Balompie Shop - Railway Deployment

## Configuración para Railway

Este proyecto está configurado para desplegarse en Railway sin problemas.

### Archivos de configuración creados:

- `railway.toml` - Configuración principal de Railway
- `nixpacks.toml` - Configuración de construcción con Nixpacks
- `.nvmrc` - Versión de Node.js (18.19.0)
- `Procfile` - Comando de inicio alternativo
- `.railwayignore` - Archivos a excluir del despliegue

### Comandos de construcción:

- **Build**: `npm run build`
- **Start**: `npm start` (vite preview --port $PORT --host 0.0.0.0)

### Variables de entorno:

- `NODE_ENV=production`
- `PORT=3000` (Railway lo establece automáticamente)

### Pasos para desplegar:

1. Conecta tu repositorio a Railway
2. Railway detectará automáticamente la configuración
3. El despliegue se realizará automáticamente

### Solución de problemas:

Si encuentras el error "el archivo de bloqueo tuvo cambios, pero el archivo de bloqueo está congelado":

1. ✅ Eliminamos `bun.lockb` para evitar conflictos
2. ✅ Usamos solo `package-lock.json` con npm
3. ✅ Configuramos Railway para usar npm en lugar de bun

El proyecto ahora está listo para Railway.
