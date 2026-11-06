require('dotenv').config();
const { connectDB, getPool, closeDB } = require('./db');

async function addSampleData() {
    await connectDB();
    const connection = await getPool().getConnection();

    try {
        await connection.beginTransaction();

        const [supplierRows] = await connection.execute(
            'SELECT SupplierID FROM Suppliers WHERE SupplierName = ? ORDER BY SupplierID LIMIT 1',
            ['FreshFoods']
        );

        let supplierId;

        if (supplierRows.length > 0) {
            supplierId = supplierRows[0].SupplierID;
            await connection.execute(
                'UPDATE Suppliers SET ContactNumber = ? WHERE SupplierID = ?',
                ['01001234567', supplierId]
            );
        } else {
            const [supplierResult] = await connection.execute(
                'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)',
                ['FreshFoods', '01001234567']
            );
            supplierId = supplierResult.insertId;
        }

        const products = [
            { productName: 'Milk', price: 15.00, stock: 50 },
            { productName: 'Bread', price: 10.00, stock: 30 },
            { productName: 'Eggs', price: 20.00, stock: 40 }
        ];

        const productIds = {};

        for (const product of products) {
            const [productRows] = await connection.execute(
                'SELECT ProductID FROM Products WHERE ProductName = ? AND SupplierID = ? ORDER BY ProductID LIMIT 1',
                [product.productName, supplierId]
            );

            if (productRows.length > 0) {
                productIds[product.productName] = productRows[0].ProductID;
                await connection.execute(
                    'UPDATE Products SET Price = ?, StockQuantity = ? WHERE ProductID = ?',
                    [product.price, product.stock, productIds[product.productName]]
                );
            } else {
                const [productResult] = await connection.execute(
                    'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
                    [product.productName, product.price, product.stock, supplierId]
                );
                productIds[product.productName] = productResult.insertId;
            }
        }

        const [saleRows] = await connection.execute(
            'SELECT SaleID FROM Sales WHERE ProductID = ? AND QuantitySold = ? AND SaleDate = ? LIMIT 1',
            [productIds.Milk, 2, '2025-05-20']
        );

        if (saleRows.length === 0) {
            await connection.execute(
                'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)',
                [productIds.Milk, 2, '2025-05-20']
            );
        }

        await connection.commit();
        console.log('Sample data was added.');
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
        await closeDB();
    }
}

addSampleData().catch(async (error) => {
    console.error(error.message);
    await closeDB();
    process.exit(1);
});
