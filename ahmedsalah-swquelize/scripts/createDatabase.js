const { createDatabase } = require('../config/database');

createDatabase()
  .then(() => {
    process.stdout.write('Database created successfully.\n');
    process.exit(0);
  })
  .catch(error => {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  });
