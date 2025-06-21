'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, insert a sample order
    await queryInterface.bulkInsert('Orders', [
      {
        userId: 2, // This should match the ID of the test user from the users seeder
        totalAmount: 510.00,
        status: 'delivered',
        shippingAddress: '456 User Lane, Mumbai',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'completed',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)  // 5 days ago
      },
      {
        userId: 2, // This should match the ID of the test user from the users seeder
        totalAmount: 225.00,
        status: 'processing',
        shippingAddress: '456 User Lane, Mumbai',
        paymentMethod: 'UPI',
        paymentStatus: 'completed',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)  // 1 day ago
      }
    ]);

    // Then, insert order items for the first order
    return queryInterface.bulkInsert('OrderItems', [
      {
        orderId: 1,
        productId: 1, // Rice
        quantity: 1,
        price: 350.00,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        orderId: 1,
        productId: 3, // Sunflower Oil
        quantity: 1,
        price: 140.00,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        orderId: 1,
        productId: 6, // Red Chilli Powder
        quantity: 1,
        price: 60.00,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      // Order items for the second order
      {
        orderId: 2,
        productId: 2, // Toor Dal
        quantity: 1,
        price: 120.00,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        orderId: 2,
        productId: 4, // Sugar
        quantity: 1,
        price: 45.00,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        orderId: 2,
        productId: 6, // Red Chilli Powder
        quantity: 1,
        price: 60.00,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('OrderItems', null, {});
    return queryInterface.bulkDelete('Orders', null, {});
  }
};