const express = require('express')
const router = express.Router()

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

      return User.create({ name, email, password })
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