const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_NAME = 'questionsandanswers';

// Drop database if exists and create new one
const setupDatabase = () => {
  const conString = 'postgres://kunchen@localhost:5432/postgres';
  const client = new Client(conString);

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
  const conString = `postgres://kunchen@localhost:5432/${DB_NAME}`;
  const client = new Client(conString);

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
  const conString = `postgres://kunchen@localhost:5432/${DB_NAME}`;
  const client = new Client(conString);

  return new Promise(async (resolve, reject) => {
    try {
      client.connect();

      const importData = fs.readFileSync(path.resolve(__dirname, './loadData.sql')).toString();
      console.log('Importing data from CSV files...');
      await client.query(importData);
      //set auto increment id start at the last index of import id + 1
      await client.query('SELECT id FROM questions WHERE id = (SELECT MAX (id)FROM questions);')
              .then((result) => {
                client.query(`ALTER SEQUENCE questions_id_seq RESTART WITH ${result.rows[0].id + 1}`)
              });
      await client.query('SELECT id FROM answers WHERE id = (SELECT MAX (id)FROM answers);')
              .then((result) => {
                client.query(`ALTER SEQUENCE answers_id_seq RESTART WITH ${result.rows[0].id + 1}`)
              });
      await client.query('SELECT id FROM photos WHERE id = (SELECT MAX (id)FROM photos);')
              .then((result) => {
                client.query(`ALTER SEQUENCE photos_id_seq RESTART WITH ${result.rows[0].id + 1}`)
              });

      console.log('Done!');

      client.end();
      resolve();
    } catch (err) {
      client.end();
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