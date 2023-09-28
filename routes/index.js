// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const User = db.User


// 設定本地驗證策略 LocalStrategy
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

// 當驗證成功後，它會將 user 物件中的重要屬性 id、name 和 email 序列化後傳遞給 done 函式(serialize 要存什麼資料到 session)
passport.serializeUser((user, done) => {
  const { id, name, email } = user
  return done(null, { id, name, email })
})

// 接收到的 user 物件中應該包含使用者的 id 屬性，反序列化後將該屬性提取出來，使用 done 回呼函式將提取的 id 值傳遞回去(只提供 user.id)(deserialize 將儲存的格式轉換回原始的使用者物件)
passport.deserializeUser((user, done) => {
  done(null, { id: user.id })
})


const restaurants = require('./restaurants')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')
// router.use 方法來設置路由分流
// 當收到以 /restaurants 開頭的請求時，則分流到 restaurants.js
// 在需要受保護的路由處理程序中使用驗證檢查站 authHandler
router.use('/restaurants', authHandler, restaurants)
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
router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error)
    }

    return res.redirect('/login')
  })
})

module.exports = router
