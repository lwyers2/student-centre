require('../models/associations')
const sequelize = require('../utils/db');
const { log } = require('../utils/logger')
const { Classification, Level } = require('../models');

beforeAll(async () => {
  console.log('Dropping all tables...');
  try {
    // Disable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Drop all tables
    await sequelize.drop();

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

    // Recreate tables
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
    console.log(Classification.associations)

    // Seed the Level table
    const level1 = await Level.create({ level: '5' });
    const level2 = await Level.create({ level: '6' });
    const level3 = await Level.create({ level: '7' });

    // Seed the Classification table
    await Classification.create({
      range_start: 0,
      range_end: 39,
      classification: 'fail',
      level_id: level1.id, // Link to level1
    });
    await Classification.create({
      range_start: 40,
      range_end: 49,
      classification: 'Third-Class Honours',
      level_id: level1.id,
    });
    await Classification.create({
      range_start: 50,
      range_end: 59,
      classification: '2:2',
      level_id: level1.id,
    });
    await Classification.create({
      range_start: 60,
      range_end: 69,
      classification: '2:1',
      level_id: level1.id,
    });
    await Classification.create({
      range_start: 70,
      range_end: 100,
      classification: 'First-Class Honors',
      level_id: level1.id,
    });

    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});

afterAll(async () => {
  // Close the DB connection after tests are done
  await sequelize.close();
});
