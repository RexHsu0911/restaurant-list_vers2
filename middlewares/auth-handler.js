// 驗證使用者是否為登入
module.exports = (req, res, next) => {
  // req.isAuthenticated() 會根據 request 的登入狀態回傳 true 或 false
  if (req.isAuthenticated()) {
    return next()
  }

  req.flash('error', '尚未登入')
  return res.redirect('/login')
}
