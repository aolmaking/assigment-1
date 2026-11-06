CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'ChangeThisPassword123!';

GRANT SELECT, INSERT, UPDATE ON assignment4_store.* TO 'store_manager'@'localhost';

REVOKE UPDATE ON assignment4_store.* FROM 'store_manager'@'localhost';

GRANT DELETE ON assignment4_store.Sales TO 'store_manager'@'localhost';

FLUSH PRIVILEGES;

SHOW GRANTS FOR 'store_manager'@'localhost';
