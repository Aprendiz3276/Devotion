require('dotenv').config();
const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const cors = require('cors');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 4000;

// Configurar multer para memoria (no guarda en disco)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  },
});

app.use(cors());
app.use(express.json());

// Endpoint para subir imagen
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió archivo' });
  }

  try {
    // Subir a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'devotion-images', // Carpeta en Cloudinary
          public_id: `img-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    console.error('Error subiendo a Cloudinary:', error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

// Endpoint para borrar imagen
app.delete('/api/delete/:publicId', async (req, res) => {
  const { publicId } = req.params;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === 'ok') {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Error al borrar imagen' });
    }
  } catch (error) {
    console.error('Error borrando de Cloudinary:', error);
    res.status(500).json({ error: 'Error al borrar imagen' });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'Backend de imágenes con Cloudinary funcionando',
    endpoints: {
      upload: 'POST /api/upload',
      delete: 'DELETE /api/delete/:publicId'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend con Cloudinary escuchando en http://localhost:${PORT}`);
});
