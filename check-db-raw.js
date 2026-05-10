const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkDestinations() {
  try {
    const res = await pool.query('SELECT id, name, "isPublished" FROM destinations');
    console.log('Destinations in DB:', res.rows);
  } catch (err) {
    console.error('Error querying DB:', err.message);
  } finally {
    await pool.end();
  }
}

checkDestinations();
