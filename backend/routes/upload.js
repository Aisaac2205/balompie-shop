import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configurar Multer para almacenamiento temporal
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// POST /api/upload/image - Subir imagen a Cloudinary
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    // Convertir buffer a base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'balompie-shop',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({ error: 'Error subiendo imagen' });
  }
});

// POST /api/upload/multiple - Subir múltiples imágenes
router.post('/multiple', upload.array('images', 6), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron imágenes' });
    }

    const uploadPromises = req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      return cloudinary.uploader.upload(dataURI, {
        folder: 'balompie-shop',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ]
      });
    });

    const results = await Promise.all(uploadPromises);
    
    const uploadedImages = results.map(result => ({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height
    }));

    res.json({ images: uploadedImages });
  } catch (error) {
    console.error('Error subiendo imágenes:', error);
    res.status(500).json({ error: 'Error subiendo imágenes' });
  }
});

// DELETE /api/upload/:publicId - Eliminar imagen de Cloudinary
router.delete('/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ message: 'Imagen eliminada correctamente' });
    } else {
      res.status(400).json({ error: 'Error eliminando imagen' });
    }
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json({ error: 'Error eliminando imagen' });
  }
});

export { router as uploadRoutes };
