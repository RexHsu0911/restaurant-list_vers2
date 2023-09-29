const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

// 新增 user 帳號
router.post('/', (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body
  // console.log(req.body)

  if (!email || !password) {
    req.flash('error', 'email 及 password 為必填')
    return res.redirect('back')
  }

  if (password !== confirmPassword) {
    req.flash('error', '驗證密碼與密碼不符')
    return res.redirect('back')
  }

  return User.count({ where: { email } })
    .then((rowCount) => {
      if (rowCount > 0) {
        // console.log(rowCount)
        req.flash('error', 'email 已註冊')
        return
      }

      // 註冊的加鹽及雜湊
      // bcrypt.hash 放入密碼明文及指定加鹽字串長度
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({ name, email, password: hash }))
    })
    .then((user) => {
      if (!user) {
        return res.redirect('back')
      }

      req.flash('success', '註冊成功')
      return res.redirect('/login')
    })
    .catch((error) => {
      error.errorMessage = '註冊失敗'
      next(error)
    })
})

module.exports = router
