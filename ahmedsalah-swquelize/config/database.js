const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseName = process.env.DB_NAME || 'assignment5_sequelize';

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName.replace(/`/g, '')}\``);
  await connection.end();
}

const sequelize = new Sequelize(
  databaseName,
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false,
    define: {
      freezeTableName: true
    }
  }
);

module.exports = { sequelize, createDatabase };
