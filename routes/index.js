// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const User = db.User


// usernameField 指定使用者名稱的欄位
passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  return User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true
  })
    .then((user) => {
      // 驗證帳密是否正確
      if (!user || user.password !== password) {
        return done(null, false, { message: 'email 或密碼錯誤' })
      }
      return done(null, user)
    })
    .catch((error) => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

// 當驗證成功後，它會將 user 物件中的重要屬性 id、name 和 email序列化後傳遞給 done 函式(要存什麼資料到 session)
passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})


const restaurants = require('./restaurants')
const users = require('./users')
// router.use 方法來設置路由分流
// 當收到以 /restaurants 開頭的請求時，則分流到 restaurants.js
router.use('/restaurants', restaurants)
router.use('/users', users)


// 顯示 restaurant 清單頁
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
// 使用 passport.authenticate 驗證登入請求
router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  // 登入失敗時有錯誤訊息顯示
  failureFlash: true
}))

//登出
router.post('/logout', (req, res) => {
  return res.send('logout')
})

module.exports = router
