'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 設置 FK not null
    await queryInterface.changeColumn('Restaurants', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Restaurants', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  }
};
