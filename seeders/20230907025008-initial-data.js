'use strict'

// 載入 restaurant.json
const restaurantList = require('../public/jsons/restaurant.json').results

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Restaurants',
      restaurantList.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        name_en: restaurant.name_en,
        category: restaurant.category,
        image: restaurant.image,
        location: restaurant.location,
        phone: restaurant.phone,
        google_map: restaurant.google_map,
        rating: restaurant.rating,
        description: restaurant.description,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      )
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', null)
  }
}

// 執行(up) seeder migration : $ npx sequelize db:seed:all
// 復原(down) seeder migration : $ npx sequelize db:seed:undo
