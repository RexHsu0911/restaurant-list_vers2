# restaurant-list_vers2
![螢幕擷取畫面 2023-09-15 172834](https://github.com/RexHsu0911/restaurant-list_vers2/assets/141574303/3e30e3bf-8aa6-4c69-a78a-36838245a22a)
## 功能
- 搜尋餐廳
- 新增餐廳
- 修改餐廳資訊
- 查看餐廳詳細資訊
- 刪除餐廳
- 排序餐廳


## 開始使用
1. 打開終端機
2. 將專案複製到本地：

   ```bash
   git clone https://github.com/RexHsu0911/restaurant-list_vers2.git
   ```
   
3. 進入專案資料夾：

   ```bash
   cd restaurant-list_vers2
   ```

4. 安裝npm：

   ```bash
   npm install
   ```

5. 啟動環境變數設置：
   
   windows powerShell
   ```bash
   set NODE_ENV=development
   ```
   Windows command line
   ```bash
   $env:NODE_ENV="development"
   ```
   Mac terminal
   ```bash
   export NODE_ENV=development
   ```

6. 新增.env檔，並設置環境參數：
   
    ```bash
   SESSION_SECRET: 自行設定
   ```

7. 啟動專案：

   ```bash
   npm run start
   ```
   
8. 若看見此行訊息則代表順利運行，打開瀏覽器進入到以下網址

   ```bash
   app is running on http://localhost:3000
   ```

9. 欲結束使用：

   ```bash
   ctrl + c
   ```

## 開發工具
- Node.js
- Express
- Express-handlebars
- body-parser
- Mysql2
- Sequelize
- Sequelize-cli
- method-override
