const { Client, Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_NAME = 'questionsandanswers';

// Drop database if exists and create new one
const setupDatabase = () => {
  const client = new Client({
    user: 'postgres',
    host: '50.18.22.164',
    database: 'postgres',
    password: '123456',
  });

  return new Promise(async (resolve, reject) => {
    try {
      client.connect();

      await client.query(`DROP DATABASE IF EXISTS ${DB_NAME};`);
      await client.query(`CREATE DATABASE ${DB_NAME};`);

      client.end();
      resolve();
    } catch (err) {
      client.end();
      reject(err);
    }
  });
}

const createTables = async () => {
  const client = new Client({
    user: 'postgres',
    host: '50.18.22.164',
    database: DB_NAME,
    password: '123456',
  });

  return new Promise(async (resolve, reject) => {
    try {
      client.connect();

      const createTables = fs.readFileSync(path.resolve(__dirname, './schema.sql')).toString();
      await client.query(createTables);

      client.end();
      resolve();
    } catch (err) {
      client.end();
      reject(err);
    }
  });
}

const importData = async () => {
  const pool = new Pool({
    user: 'postgres',
    host: '50.18.22.164',
    database: DB_NAME,
    password: '123456',
  })
  return new Promise(async (resolve, reject) => {
    try {
      const importData = fs.readFileSync(path.resolve(__dirname, './loadData.sql')).toString();
      console.log('Importing data from CSV files...');
      await pool.query(importData);

      //set auto increment id start at the last index of import id + 1
      await pool.query('SELECT id FROM questions WHERE id = (SELECT MAX (id)FROM questions);')
              .then((result) => {
                pool.query(`ALTER SEQUENCE questions_id_seq RESTART WITH ${result.rows[0].id + 1};`)
                pool.query(`ALTER SEQUENCE questions_qId_seq RESTART WITH ${result.rows[0].id + 1};`)
              })
              .catch((err) => {
                pool.end();
                reject(err);
              });

      await pool.query('SELECT id FROM answers WHERE id = (SELECT MAX (id)FROM answers);')
              .then((result) => {
                pool.query(`ALTER SEQUENCE answers_id_seq RESTART WITH ${result.rows[0].id + 1};`)
                pool.query(`ALTER SEQUENCE answers_aId_seq RESTART WITH ${result.rows[0].id + 1};`)
              })
              .catch((err) => {
                pool.end();
                reject(err);
              });

      await pool.query(`SELECT setval('photos_id_seq', coalesce(max(id), 0) + 1, false) FROM photos;`)
                .catch((err) => {
                  pool.end();
                  reject(err);
                });

      console.log('Done!');

      pool.end();
      resolve();
    } catch (err) {
      pool.end();
      reject(err);
    }
  });
}

// Run setup functions with IIFE
(async () => {
  console.log('Initializing database setup...');
  try {
    await setupDatabase();
    console.log('✅ successfully created database');
    await createTables();
    console.log('✅ successfully created tables');
    await importData();
    console.log('✅ successfully imported data');
  } catch (err) {
    console.log('❌ Uh oh, an error occurred:', err)
  }
})();