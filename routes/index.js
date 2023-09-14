// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')
// 以 /restaurants 開頭的話，則分流到 restaurants.js
router.use('/', restaurants)



router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router