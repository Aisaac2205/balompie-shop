import express from 'express';
import { getClient } from '../config/database.js';

const router = express.Router();

// GET /api/teams - Obtener todos los equipos
router.get('/', async (req, res) => {
  const client = await getClient();
  
  try {
    const { rows } = await client.query(`
      SELECT * FROM teams ORDER BY name ASC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo equipos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// GET /api/teams/:id - Obtener equipo por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const client = await getClient();
  
  try {
    const { rows } = await client.query(`
      SELECT * FROM teams WHERE id = $1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo equipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// POST /api/teams - Crear nuevo equipo
router.post('/', async (req, res) => {
  const {
    name,
    country,
    league,
    foundedYear,
    achievements,
    socialMedia,
    logoUrl,
    primaryColor
  } = req.body;
  
  const client = await getClient();
  
  try {
    const { rows } = await client.query(`
      INSERT INTO teams (
        name, country, league, founded_year, achievements,
        social_media, logo_url, primary_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      name, country, league, foundedYear, achievements,
      socialMedia, logoUrl, primaryColor
    ]);
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creando equipo:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Ya existe un equipo con ese nombre' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } finally {
    client.release();
  }
});

// PUT /api/teams/:id - Actualizar equipo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    country,
    league,
    foundedYear,
    achievements,
    socialMedia,
    logoUrl,
    primaryColor
  } = req.body;
  
  const client = await getClient();
  
  try {
    const { rows } = await client.query(`
      UPDATE teams SET
        name = COALESCE($1, name),
        country = COALESCE($2, country),
        league = COALESCE($3, league),
        founded_year = COALESCE($4, founded_year),
        achievements = COALESCE($5, achievements),
        social_media = COALESCE($6, social_media),
        logo_url = COALESCE($7, logo_url),
        primary_color = COALESCE($8, primary_color),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `, [
      name, country, league, foundedYear, achievements,
      socialMedia, logoUrl, primaryColor, id
    ]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error actualizando equipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// DELETE /api/teams/:id - Eliminar equipo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const client = await getClient();
  
  try {
    const { rows } = await client.query(`
      DELETE FROM teams WHERE id = $1 RETURNING *
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Equipo no encontrado' });
    }
    
    res.json({ message: 'Equipo eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando equipo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

export { router as teamRoutes };
