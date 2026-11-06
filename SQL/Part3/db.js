const mysql = require('mysql2/promise');

let pool;

async function connectDB() {
    const dbName = process.env.DB_NAME || 'assignment4_store';

    if (!/^[A-Za-z0-9_]+$/.test(dbName)) {
        throw new Error('Database name is not valid.');
    }

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        dateStrings: true
    });

    await pool.query(`
        CREATE TABLE IF NOT EXISTS Suppliers (
            SupplierID INT AUTO_INCREMENT PRIMARY KEY,
            SupplierName VARCHAR(150) NOT NULL,
            ContactNumber VARCHAR(50) NOT NULL
        ) ENGINE=InnoDB
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS Products (
            ProductID INT AUTO_INCREMENT PRIMARY KEY,
            ProductName VARCHAR(255) NULL,
            Price DECIMAL(10, 2) NOT NULL,
            StockQuantity INT NOT NULL,
            SupplierID INT NOT NULL,
            CONSTRAINT fk_products_supplier
                FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
                ON UPDATE CASCADE ON DELETE RESTRICT
        ) ENGINE=InnoDB
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS Sales (
            SaleID INT AUTO_INCREMENT PRIMARY KEY,
            ProductID INT NOT NULL,
            QuantitySold INT NOT NULL,
            SaleDate DATE NOT NULL,
            CONSTRAINT fk_sales_product
                FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
                ON UPDATE CASCADE ON DELETE RESTRICT
        ) ENGINE=InnoDB
    `);

    return pool;
}

function getPool() {
    if (!pool) {
        throw new Error('Database is not connected.');
    }

    return pool;
}

async function closeDB() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}

module.exports = { connectDB, getPool, closeDB };
