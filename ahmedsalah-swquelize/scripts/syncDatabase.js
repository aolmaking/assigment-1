const { sequelize, createDatabase } = require('../config/database');
require('../models');

async function syncDatabase() {
  await createDatabase();
  await sequelize.authenticate();
  await sequelize.sync();
  process.stdout.write('Tables created successfully.\n');
  await sequelize.close();
}

syncDatabase().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
