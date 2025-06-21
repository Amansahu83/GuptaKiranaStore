'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', [
      {
        name: 'Rice (5kg)',
        description: 'Premium quality basmati rice, perfect for everyday meals.',
        price: 350.00,
        stock: 50,
        category: 'Grains',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Toor Dal (1kg)',
        description: 'High-quality split pigeon peas, rich in protein.',
        price: 120.00,
        stock: 40,
        category: 'Pulses',
        imageUrl: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sunflower Oil (1L)',
        description: 'Pure refined sunflower oil for healthy cooking.',
        price: 140.00,
        stock: 30,
        category: 'Oils',
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sugar (1kg)',
        description: 'Fine grain white sugar for your daily needs.',
        price: 45.00,
        stock: 60,
        category: 'Essentials',
        imageUrl: 'https://images.unsplash.com/photo-1610137312679-8a86adc5d80f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Wheat Flour (5kg)',
        description: 'Finely ground whole wheat flour for chapatis and bread.',
        price: 180.00,
        stock: 45,
        category: 'Grains',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Red Chilli Powder (100g)',
        description: 'Hot and spicy red chilli powder for flavorful dishes.',
        price: 60.00,
        stock: 35,
        category: 'Spices',
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821eec67e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {});
  }
};