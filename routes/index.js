// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')
const users = require('./users')
// router.use 方法來設置路由分流
// 當收到以 /restaurants 開頭的請求時，則分流到 restaurants.js
router.use('/restaurants', restaurants)
router.use('/users', users)


router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

// 註冊頁
router.get('/register', (req, res) => {
  return res.render('register')
})

// 登入頁
router.get('/login', (req, res) => {
  return res.render('login')
})

// 登入
router.post('/login', (req, res) => {
  return res.send('req.body')
})

//登出
router.post('/logout', (req, res) => {
  return res.send('logout')
})

module.exports = router
