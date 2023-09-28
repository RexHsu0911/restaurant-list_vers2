'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 建立 models 關聯
    await queryInterface.addColumn('Restaurants', 'userId', {
      type: Sequelize.INTEGER,
      // 參考了 "Users" 資料表的 "id" 欄位(表明 "userId" 欄位是一個 foreign key)
      references: {
        model: 'Users',
        key: 'id'
      },
      // 設定為 'CASCADE' 表示當 "Users" 資料表中的記錄被刪除時，相應的 "Todos" 資料表中的記錄也會被刪除
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'userId')
  }
};


// 在 MySQL Workbench 對現有的 restaurants 指定 userId (可自行選擇 user table 中的 id)，這裡使用 update 來達成：UPDATE Todos SET userID = 1;