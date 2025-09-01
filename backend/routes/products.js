import express from 'express';
import { getClient } from '../config/database.js';

const router = express.Router();

// GET /api/products - Obtener todos los productos
router.get('/', async (req, res) => {
  const client = await getClient();
  
  try {
    const { rows } = await client.query(`
      SELECT p.*, t.name as team_name, t.logo_url as team_logo
      FROM products p
      LEFT JOIN teams t ON p.team = t.name
      WHERE p.is_active = true
      ORDER BY p.created_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// GET /api/products/:id - Obtener producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const client = await getClient();
  
  try {
    const { rows } = await client.query(`
      SELECT p.*, t.name as team_name, t.logo_url as team_logo
      FROM products p
      LEFT JOIN teams t ON p.team = t.name
      WHERE p.id = $1 AND p.is_active = true
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// POST /api/products - Crear nuevo producto
router.post('/', async (req, res) => {
  const {
    name,
    team,
    equipmentType,
    productType,
    price,
    playerPrice,
    description,
    images,
    sizes,
    primaryColor,
    isActive = true
  } = req.body;
  
  const client = await getClient();
  
  try {
    // Verificar que el equipo existe
    const teamCheck = await client.query('SELECT id FROM teams WHERE name = $1', [team]);
    if (teamCheck.rows.length === 0) {
      return res.status(400).json({ error: 'El equipo especificado no existe' });
    }
    
    const { rows } = await client.query(`
      INSERT INTO products (
        name, team, equipment_type, product_type, price, player_price,
        description, images, sizes, primary_color, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      name, team, equipmentType, productType, price, playerPrice,
      description, images, sizes, primaryColor, isActive
    ]);
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// PUT /api/products/:id - Actualizar producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    team,
    equipmentType,
    productType,
    price,
    playerPrice,
    description,
    images,
    sizes,
    primaryColor,
    isActive
  } = req.body;
  
  const client = await getClient();
  
  try {
    // Verificar que el producto existe
    const productCheck = await client.query('SELECT id FROM products WHERE id = $1', [id]);
    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    // Verificar que el equipo existe si se está cambiando
    if (team) {
      const teamCheck = await client.query('SELECT id FROM teams WHERE name = $1', [team]);
      if (teamCheck.rows.length === 0) {
        return res.status(400).json({ error: 'El equipo especificado no existe' });
      }
    }
    
    const { rows } = await client.query(`
      UPDATE products SET
        name = COALESCE($1, name),
        team = COALESCE($2, team),
        equipment_type = COALESCE($3, equipment_type),
        product_type = COALESCE($4, product_type),
        price = COALESCE($5, price),
        player_price = COALESCE($6, player_price),
        description = COALESCE($7, description),
        images = COALESCE($8, images),
        sizes = COALESCE($9, sizes),
        primary_color = COALESCE($10, primary_color),
        is_active = COALESCE($11, is_active),
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `, [
      name, team, equipmentType, productType, price, playerPrice,
      description, images, sizes, primaryColor, isActive, id
    ]);
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const client = await getClient();
  
  try {
    const { rows } = await client.query(`
      DELETE FROM products WHERE id = $1 RETURNING *
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

export { router as productRoutes };
