require('dotenv').config();
const express = require('express');
const { connectDB, getPool, closeDB } = require('./db');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use((req, res, next) => {
    req.body = req.body || {};
    next();
});

function run(callback) {
    return (req, res, next) => {
        Promise.resolve(callback(req, res, next)).catch(next);
    };
}

function validId(value) {
    const hasValue = typeof value === 'number' || (typeof value === 'string' && value.trim() !== '');
    const number = Number(value);
    return hasValue && Number.isSafeInteger(number) && number > 0;
}

function validNumber(value) {
    return (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) && Number.isFinite(Number(value)) && Number(value) >= 0;
}

function validInteger(value) {
    return (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) && Number.isSafeInteger(Number(value)) && Number(value) >= 0;
}

function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function cleanText(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function adminOnly(req, res, next) {
    const adminKey = process.env.ADMIN_API_KEY;

    if (!adminKey || req.headers['x-admin-key'] !== adminKey) {
        return res.status(403).json({ message: 'You are not allowed to do this operation.' });
    }

    next();
}

app.get('/', (req, res) => {
    res.json({ message: 'Store API is running.' });
});

app.post('/api/products', run(async (req, res) => {
    const productName = cleanText(req.body.productName);
    const price = req.body.price;
    const stockQuantity = req.body.stockQuantity;
    const supplierId = req.body.supplierId;

    if (!productName || !validNumber(price) || !validInteger(stockQuantity) || !validId(supplierId)) {
        return res.status(400).json({ message: 'Enter valid product data.' });
    }

    const [result] = await getPool().execute(
        'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
        [productName, Number(price), Number(stockQuantity), Number(supplierId)]
    );

    const [rows] = await getPool().execute('SELECT * FROM Products WHERE ProductID = ?', [result.insertId]);
    res.status(201).json({ message: 'Product added.', data: rows[0] });
}));

app.get('/api/products', run(async (req, res) => {
    const [rows] = await getPool().query('SELECT * FROM Products ORDER BY ProductID');
    res.json({ data: rows });
}));

app.get('/api/products/:id', run(async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Enter a valid product ID.' });
    }

    const [rows] = await getPool().execute('SELECT * FROM Products WHERE ProductID = ?', [Number(req.params.id)]);

    if (rows.length === 0) {
        return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ data: rows[0] });
}));

app.put('/api/products/:id', run(async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Enter a valid product ID.' });
    }

    const columns = {
        productName: 'ProductName',
        price: 'Price',
        stockQuantity: 'StockQuantity',
        supplierId: 'SupplierID'
    };
    const fields = [];
    const values = [];

    for (const key of Object.keys(columns)) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
            const value = req.body[key];

            if (key === 'productName') {
                const name = cleanText(value);
                if (!name) {
                    return res.status(400).json({ message: 'Product name is required.' });
                }
                values.push(name);
            } else if (key === 'price') {
                if (!validNumber(value)) {
                    return res.status(400).json({ message: 'Enter a valid price.' });
                }
                values.push(Number(value));
            } else if (key === 'stockQuantity') {
                if (!validInteger(value)) {
                    return res.status(400).json({ message: 'Enter a valid stock quantity.' });
                }
                values.push(Number(value));
            } else {
                if (!validId(value)) {
                    return res.status(400).json({ message: 'Enter a valid supplier ID.' });
                }
                values.push(Number(value));
            }

            fields.push(`${columns[key]} = ?`);
        }
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: 'Enter at least one field to update.' });
    }

    values.push(Number(req.params.id));
    const [result] = await getPool().execute(
        `UPDATE Products SET ${fields.join(', ')} WHERE ProductID = ?`,
        values
    );

    const [rows] = await getPool().execute('SELECT * FROM Products WHERE ProductID = ?', [Number(req.params.id)]);

    if (rows.length === 0) {
        return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ message: result.affectedRows ? 'Product updated.' : 'No changes were made.', data: rows[0] });
}));

app.patch('/api/products/bread/price', run(async (req, res) => {
    const [result] = await getPool().execute(
        'UPDATE Products SET Price = 25.00 WHERE ProductName = ?',
        ['Bread']
    );

    const [rows] = await getPool().execute('SELECT ProductID, ProductName, Price FROM Products WHERE ProductName = ?', ['Bread']);

    if (rows.length === 0) {
        return res.status(404).json({ message: 'Bread was not found.' });
    }

    res.json({ message: 'Bread price is now 25.00.', affectedRows: result.affectedRows, data: rows });
}));

app.delete('/api/products/eggs', run(async (req, res) => {
    const [result] = await getPool().execute('DELETE FROM Products WHERE ProductName = ?', ['Eggs']);

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Eggs was not found.' });
    }

    res.json({ message: 'Eggs deleted.', deletedRows: result.affectedRows });
}));

app.delete('/api/products/:id', run(async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Enter a valid product ID.' });
    }

    const [result] = await getPool().execute('DELETE FROM Products WHERE ProductID = ?', [Number(req.params.id)]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ message: 'Product deleted.' });
}));

app.post('/api/suppliers', run(async (req, res) => {
    const supplierName = cleanText(req.body.supplierName);
    const contactNumber = cleanText(req.body.contactNumber);

    if (!supplierName || !contactNumber) {
        return res.status(400).json({ message: 'Supplier name and contact number are required.' });
    }

    const [result] = await getPool().execute(
        'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)',
        [supplierName, contactNumber]
    );

    const [rows] = await getPool().execute('SELECT * FROM Suppliers WHERE SupplierID = ?', [result.insertId]);
    res.status(201).json({ message: 'Supplier added.', data: rows[0] });
}));

app.get('/api/suppliers', run(async (req, res) => {
    const [rows] = await getPool().query('SELECT * FROM Suppliers ORDER BY SupplierID');
    res.json({ data: rows });
}));

app.put('/api/suppliers/:id', run(async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Enter a valid supplier ID.' });
    }

    const fields = [];
    const values = [];

    if (Object.prototype.hasOwnProperty.call(req.body, 'supplierName')) {
        const supplierName = cleanText(req.body.supplierName);
        if (!supplierName) {
            return res.status(400).json({ message: 'Supplier name is required.' });
        }
        fields.push('SupplierName = ?');
        values.push(supplierName);
    }

    if (Object.prototype.hasOwnProperty.call(req.body, 'contactNumber')) {
        const contactNumber = cleanText(req.body.contactNumber);
        if (!contactNumber) {
            return res.status(400).json({ message: 'Contact number is required.' });
        }
        fields.push('ContactNumber = ?');
        values.push(contactNumber);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: 'Enter supplier information to update.' });
    }

    values.push(Number(req.params.id));
    await getPool().execute(`UPDATE Suppliers SET ${fields.join(', ')} WHERE SupplierID = ?`, values);
    const [rows] = await getPool().execute('SELECT * FROM Suppliers WHERE SupplierID = ?', [Number(req.params.id)]);

    if (rows.length === 0) {
        return res.status(404).json({ message: 'Supplier not found.' });
    }

    res.json({ message: 'Supplier updated.', data: rows[0] });
}));

app.delete('/api/suppliers/:id', run(async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ message: 'Enter a valid supplier ID.' });
    }

    const [result] = await getPool().execute('DELETE FROM Suppliers WHERE SupplierID = ?', [Number(req.params.id)]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Supplier not found.' });
    }

    res.json({ message: 'Supplier deleted.' });
}));

app.post('/api/sales', run(async (req, res) => {
    const productId = req.body.productId;
    const quantitySold = req.body.quantitySold;
    const saleDate = req.body.saleDate;

    if (!validId(productId) || !validId(quantitySold) || !validDate(saleDate)) {
        return res.status(400).json({ message: 'Enter a product ID, quantity, and date in YYYY-MM-DD format.' });
    }

    const [result] = await getPool().execute(
        'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)',
        [Number(productId), Number(quantitySold), saleDate]
    );

    const [rows] = await getPool().execute('SELECT * FROM Sales WHERE SaleID = ?', [result.insertId]);
    res.status(201).json({ message: 'Sale added.', data: rows[0] });
}));

app.get('/api/sales', run(async (req, res) => {
    const [rows] = await getPool().query('SELECT * FROM Sales ORDER BY SaleDate DESC');
    res.json({ data: rows });
}));

app.get('/api/sales/product/:productId', run(async (req, res) => {
    if (!validId(req.params.productId)) {
        return res.status(400).json({ message: 'Enter a valid product ID.' });
    }

    const [rows] = await getPool().execute(
        'SELECT * FROM Sales WHERE ProductID = ? ORDER BY SaleDate DESC',
        [Number(req.params.productId)]
    );
    res.json({ data: rows });
}));

app.get('/api/reports/total-sold', run(async (req, res) => {
    const [rows] = await getPool().query(`
        SELECT p.ProductID, p.ProductName, COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
        FROM Products p
        LEFT JOIN Sales s ON p.ProductID = s.ProductID
        GROUP BY p.ProductID, p.ProductName
        ORDER BY p.ProductID
    `);
    res.json({ data: rows });
}));

app.get('/api/reports/highest-stock', run(async (req, res) => {
    const [rows] = await getPool().query(`
        SELECT ProductID, ProductName, StockQuantity
        FROM Products
        ORDER BY StockQuantity DESC
        LIMIT 1
    `);

    if (rows.length === 0) {
        return res.status(404).json({ message: 'There are no products.' });
    }

    res.json({ data: rows[0] });
}));

app.get('/api/reports/suppliers-starting-with-f', run(async (req, res) => {
    const [rows] = await getPool().execute(
        'SELECT * FROM Suppliers WHERE SupplierName LIKE ? ORDER BY SupplierName',
        ['F%']
    );
    res.json({ data: rows });
}));

app.get('/api/reports/products-never-sold', run(async (req, res) => {
    const [rows] = await getPool().query(`
        SELECT p.*
        FROM Products p
        WHERE NOT EXISTS (
            SELECT 1 FROM Sales s WHERE s.ProductID = p.ProductID
        )
        ORDER BY p.ProductID
    `);
    res.json({ data: rows });
}));

app.get('/api/reports/sales-details', run(async (req, res) => {
    const [rows] = await getPool().query(`
        SELECT p.ProductName, s.QuantitySold, s.SaleDate
        FROM Sales s
        INNER JOIN Products p ON s.ProductID = p.ProductID
        ORDER BY s.SaleDate DESC
    `);
    res.json({ data: rows });
}));

app.post('/api/database/add-category', adminOnly, run(async (req, res) => {
    const [rows] = await getPool().execute(`
        SELECT COUNT(*) AS total
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Products' AND COLUMN_NAME = 'Category'
    `);

    if (Number(rows[0].total) > 0) {
        return res.status(409).json({ message: 'Category column already exists.' });
    }

    await getPool().query('ALTER TABLE Products ADD COLUMN Category VARCHAR(100)');
    res.json({ message: 'Category column added.' });
}));

app.delete('/api/database/remove-category', adminOnly, run(async (req, res) => {
    const [rows] = await getPool().execute(`
        SELECT COUNT(*) AS total
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Products' AND COLUMN_NAME = 'Category'
    `);

    if (Number(rows[0].total) === 0) {
        return res.status(404).json({ message: 'Category column does not exist.' });
    }

    await getPool().query('ALTER TABLE Products DROP COLUMN Category');
    res.json({ message: 'Category column removed.' });
}));

app.patch('/api/database/contact-number-length', adminOnly, run(async (req, res) => {
    const [rows] = await getPool().query(`
        SELECT COUNT(*) AS total
        FROM Suppliers
        WHERE CHAR_LENGTH(ContactNumber) > 15
    `);

    if (Number(rows[0].total) > 0) {
        return res.status(409).json({ message: 'Some contact numbers are longer than 15 characters.' });
    }

    await getPool().query('ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15) NOT NULL');
    res.json({ message: 'ContactNumber changed to VARCHAR(15).' });
}));

app.patch('/api/database/product-name-not-null', adminOnly, run(async (req, res) => {
    const [rows] = await getPool().query('SELECT COUNT(*) AS total FROM Products WHERE ProductName IS NULL');

    if (Number(rows[0].total) > 0) {
        return res.status(409).json({ message: 'There are products with a NULL name.' });
    }

    await getPool().query('ALTER TABLE Products MODIFY ProductName VARCHAR(255) NOT NULL');
    res.json({ message: 'ProductName is now NOT NULL.' });
}));

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found.' });
});

app.use((error, req, res, next) => {
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ message: 'The related supplier or product does not exist.' });
    }

    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({ message: 'This record is connected to another record and cannot be deleted.' });
    }

    res.status(500).json({ message: 'Server error.' });
});

async function startServer() {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

startServer();

process.on('SIGINT', async () => {
    await closeDB();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeDB();
    process.exit(0);
});
