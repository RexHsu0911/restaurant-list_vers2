'use strict'

// 載入 restaurant.json
const restaurantList = require('../public/jsons/restaurant.json').results

const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 實作 Users 與 Restaurants 關聯的資料
    let transaction

    try {
      // transaction 確保資料庫操作的一致性
      transaction = await queryInterface.sequelize.transaction()

      const hash = await bcrypt.hash('12345678', 10)

      await queryInterface.bulkInsert('Users', [
        {
          id: 1,
          name: 'user1',
          email: 'user1@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'user2',
          email: 'user2@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction })

      const user1RestaurantData = restaurantList.slice(0, 3).map((restaurant) => ({
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
        updatedAt: new Date(),
        userId: 1
      }))

      const user2RestaurantData = restaurantList.slice(3, 6).map((restaurant) => ({
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
        updatedAt: new Date(),
        userId: 2
      }))

      const restaurantDataToInsert = [...user1RestaurantData, ...user2RestaurantData]

      await queryInterface.bulkInsert('Restaurants',
        restaurantDataToInsert, { transaction })

      // 操作成功則提交 commit()，否則取消 rollback() 以還原資料庫狀態
      await transaction.commit()
    } catch (error) {
      console.error("Error occurred:", error)
      if (transaction) await transaction.rollback()
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
}

// 執行(up) seeder migration : $ npx sequelize db:seed:all
// 復原(down) seeder migration : $ npx sequelize db:seed:undo
