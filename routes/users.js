const express = require('express')
const router = express.Router()

const db = require('../models')
const User = db.User


// 新增帳號
router.post('/', (req, res) => {
  return res.send('req.body')
})

module.exports = router