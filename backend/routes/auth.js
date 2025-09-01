import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getClient } from '../config/database.js';

const router = express.Router();

// POST /api/auth/login - Login de admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }
  
  const client = await getClient();
  
  try {
    // Buscar usuario por email
    const { rows } = await client.query(`
      SELECT * FROM admin_users WHERE email = $1
    `, [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const user = rows[0];
    
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    // Actualizar último login
    await client.query(`
      UPDATE admin_users SET last_login = NOW() WHERE id = $1
    `, [user.id]);
    
    // Generar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Enviar respuesta sin la contraseña
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// POST /api/auth/register - Registrar nuevo admin (solo para desarrollo)
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  
  const client = await getClient();
  
  try {
    // Verificar si el usuario ya existe
    const existingUser = await client.query(`
      SELECT id FROM admin_users WHERE email = $1
    `, [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    
    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Crear usuario
    const { rows } = await client.query(`
      INSERT INTO admin_users (email, password_hash, name, role)
      VALUES ($1, $2, $3, 'admin')
      RETURNING id, email, name, role, created_at
    `, [email, passwordHash, name]);
    
    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: rows[0]
    });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// GET /api/auth/me - Obtener usuario actual
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const client = await getClient();
    const { rows } = await client.query(`
      SELECT id, email, name, role, created_at, last_login
      FROM admin_users WHERE id = $1
    `, [decoded.userId]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

export { router as authRoutes };
