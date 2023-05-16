const { Pool } = require('pg');

const dotenv = require('dotenv');
dotenv.config();



const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });


function connectToDatabase() {
    return new Promise((resolve, reject) => {
      pool.connect((err, client, release) => {
        if (err) {
          reject(err);
        } else {
          resolve({ client, release });
        }
      });
    });
  }


function createTables(client, release, query) {
    client.query(query, (err, result) => {
      release(); 
      if (err) {
        console.error('Error executing query', err);
        return;
      } else {
        console.log('all tables have been created');
      }
    });
  }





  

module.exports = {pool, connectToDatabase, createTables};