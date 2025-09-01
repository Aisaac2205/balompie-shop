import { getClient } from './config/database.js';
import bcrypt from 'bcryptjs';

const initializeDatabase = async () => {
  const client = await getClient();
  
  try {
    console.log('🌱 Inicializando base de datos con datos de ejemplo...');
    
    // Crear usuario admin por defecto
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash('admin123', saltRounds);
    
    await client.query(`
      INSERT INTO admin_users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@jerseyrealm.com', passwordHash, 'Administrador', 'super_admin']);
    
    // Insertar equipos de ejemplo
    const teams = [
      {
        name: 'Barcelona',
        country: 'España',
        league: 'La Liga',
        foundedYear: 1899,
        achievements: ['26 La Liga', '5 Champions League', '31 Copa del Rey'],
        socialMedia: {
          instagram: 'fcbarcelona',
          twitter: 'FCBarcelona',
          facebook: 'fcbarcelona'
        },
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
        primaryColor: '#004D98'
      },
      {
        name: 'Real Madrid',
        country: 'España',
        league: 'La Liga',
        foundedYear: 1902,
        achievements: ['36 La Liga', '14 Champions League', '20 Copa del Rey'],
        socialMedia: {
          instagram: 'realmadrid',
          twitter: 'realmadrid',
          facebook: 'realmadrid'
        },
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
        primaryColor: '#FFFFFF'
      },
      {
        name: 'Manchester United',
        country: 'Inglaterra',
        league: 'Premier League',
        foundedYear: 1878,
        achievements: ['20 Premier League', '3 Champions League', '12 FA Cup'],
        socialMedia: {
          instagram: 'manchesterunited',
          twitter: 'ManUtd',
          facebook: 'manchesterunited'
        },
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg',
        primaryColor: '#DA291C'
      },
      {
        name: 'Liverpool',
        country: 'Inglaterra',
        league: 'Premier League',
        foundedYear: 1892,
        achievements: ['19 Premier League', '6 Champions League', '8 FA Cup'],
        socialMedia: {
          instagram: 'liverpoolfc',
          twitter: 'LFC',
          facebook: 'LiverpoolFC'
        },
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
        primaryColor: '#C8102E'
      },
      {
        name: 'Bayern Munich',
        country: 'Alemania',
        league: 'Bundesliga',
        foundedYear: 1900,
        achievements: ['33 Bundesliga', '6 Champions League', '20 DFB-Pokal'],
        socialMedia: {
          instagram: 'fcbayern',
          twitter: 'FCBayernEN',
          facebook: 'fcbayern'
        },
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
        primaryColor: '#DC052C'
      }
    ];
    
    for (const team of teams) {
      await client.query(`
        INSERT INTO teams (name, country, league, founded_year, achievements, social_media, logo_url, primary_color)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (name) DO NOTHING
      `, [
        team.name, team.country, team.league, team.foundedYear,
        team.achievements, JSON.stringify(team.socialMedia),
        team.logoUrl, team.primaryColor
      ]);
    }
    
    // Insertar productos de ejemplo
    const products = [
      {
        name: 'Barcelona 2024/25 - Local - Fan',
        team: 'Barcelona',
        equipmentType: 'local',
        productType: 'fan',
        price: 89.99,
        playerPrice: 89.99,
        description: 'Camiseta oficial del Barcelona temporada 2024/25, versión fan. Material transpirable y cómodo.',
        images: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        primaryColor: '#004D98',
        isActive: true
      },
      {
        name: 'Real Madrid 2024/25 - Local - Player',
        team: 'Real Madrid',
        equipmentType: 'local',
        productType: 'player',
        price: 89.99,
        playerPrice: 129.99,
        description: 'Camiseta oficial del Real Madrid temporada 2024/25, versión jugador. Material premium para máximo rendimiento.',
        images: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        primaryColor: '#FFFFFF',
        isActive: true
      },
      {
        name: 'Manchester United 2024/25 - Visitante - Fan',
        team: 'Manchester United',
        equipmentType: 'visitante',
        productType: 'fan',
        price: 84.99,
        playerPrice: 84.99,
        description: 'Camiseta visitante oficial del Manchester United temporada 2024/25, versión fan.',
        images: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
        ],
        sizes: ['M', 'L', 'XL'],
        primaryColor: '#DA291C',
        isActive: true
      }
    ];
    
    for (const product of products) {
      await client.query(`
        INSERT INTO products (name, team, equipment_type, product_type, price, player_price, description, images, sizes, primary_color, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT DO NOTHING
      `, [
        product.name, product.team, product.equipmentType, product.productType,
        product.price, product.playerPrice, product.description, product.images,
        product.sizes, product.primaryColor, product.isActive
      ]);
    }
    
    console.log('✅ Base de datos inicializada correctamente');
    console.log('👤 Usuario admin: admin@jerseyrealm.com / admin123');
    console.log('🏆 Equipos agregados:', teams.length);
    console.log('📦 Productos agregados:', products.length);
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  } finally {
    client.release();
    process.exit(0);
  }
};

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };
