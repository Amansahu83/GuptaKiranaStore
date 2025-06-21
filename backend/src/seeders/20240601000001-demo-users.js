'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    return queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@guptakirana.com',
        password: adminPassword,
        role: 'admin',
        address: '123 Admin Street, Delhi',
        phone: '9876543210',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test User',
        email: 'user@example.com',
        password: userPassword,
        role: 'user',
        address: '456 User Lane, Mumbai',
        phone: '8765432109',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};