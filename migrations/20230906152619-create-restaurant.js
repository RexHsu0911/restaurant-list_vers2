'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name_en: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.TEXT
      },
      phone: {
        type: Sequelize.STRING
      },
      google_map: {
        type: Sequelize.TEXT
      },
      rating: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.FLOAT.UNSIGNED
      },
      description: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Restaurants')
  }
}

// 執行(up) migration : $ npx sequelize db:migrate
// 復原(down) migration : $ npx sequelize db:seed:undo
