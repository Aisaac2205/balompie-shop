import pkg from 'pg';
const { Pool } = pkg;

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Función para conectar a la base de datos
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conectado a PostgreSQL');
    client.release();
    
    // Crear tablas si no existen
    await createTables();
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    throw error;
  }
};

// Función para crear las tablas
const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // Tabla de equipos
    await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
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
      )
    `);

    // Tabla de productos
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
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
        updated_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (team) REFERENCES teams(name) ON DELETE CASCADE
      )
    `);

    // Tabla de usuarios admin
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW(),
        last_login TIMESTAMP
      )
    `);

    console.log('✅ Tablas creadas/verificadas correctamente');
  } catch (error) {
    console.error('❌ Error creando tablas:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Función para obtener una conexión
export const getClient = () => pool.connect();

// Función para cerrar la conexión
export const closeDB = async () => {
  await pool.end();
};

export default pool;
