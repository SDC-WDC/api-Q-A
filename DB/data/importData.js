const { Client, Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_NAME = 'questionsandanswers';

// Drop database if exists and create new one
const setupDatabase = () => {
  const client = new Client({
    user: 'kunchen',
    host: 'localhost',
    database: 'postgres',
    password: '',
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
    user: 'kunchen',
    host: 'localhost',
    database: DB_NAME,
    password: '',
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
    user: 'kunchen',
    host: 'localhost',
    database: DB_NAME,
    password: '',
  })
  return new Promise(async (resolve, reject) => {
    try {
      const importData = fs.readFileSync(path.resolve(__dirname, './loadData.sql')).toString();
      console.log('Importing data from CSV files...');
      await pool.query(importData);

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