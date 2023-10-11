// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const passport = require('passport')

const root = require('./root')
const oauth = require('./oauth')
const restaurants = require('./restaurants')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')
// router.use 方法來設置路由分流
// 當收到以 /restaurants 開頭的請求時，則分流到 restaurants.js
// 在需要受保護的路由處理程序中使用驗證檢查站 authHandler
router.use('/', root)
router.use('/oauth', oauth)
router.use('/restaurants', authHandler, restaurants)
router.use('/users', users)

module.exports = router