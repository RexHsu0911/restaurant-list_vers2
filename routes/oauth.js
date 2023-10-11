// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const passport = require('passport')


// 登入請求轉址路由
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }))

router.get('/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  // 登入失敗時有錯誤訊息顯示
  failureFlash: true
}))

module.exports = router