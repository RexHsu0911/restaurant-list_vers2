// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const passport = require('passport')


// 顯示 restaurant 清單頁
router.get('/', (req, res) => {
  res.render('index')
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


// 登出
router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error)
    }

    return res.redirect('/login')
  })
})

module.exports = router