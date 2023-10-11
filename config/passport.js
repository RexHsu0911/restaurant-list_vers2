const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')

const bcrypt = require('bcryptjs')

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
      if (!user) {
        return done(null, false, { message: 'email 或密碼錯誤' })
      }

      // bcrypt.compare() 第一個參數放入要比對的明文，第二個參數則是資料庫中的雜湊值
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: 'email 或密碼錯誤' })
          }

          return done(null, user)
        })
    })
    .catch((error) => {
      error.errorMessage = '登入失敗'
      done(error)
    })
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  // 設定 profileFields，指定要取得使用者 Facebook 個人資訊的哪些欄位，取得使用者的電子郵件地址 ('email') 和顯示名稱 ('displayName')
  profileFields: ['email', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
  // console.log('accessToken', accessToken)
  // console.log('profile', profile)
  const email = profile.emails[0].value
  const name = profile.displayName

  // 尋找資料庫中是否有符合該電子郵件地址的使用者
  return User.findOne({
    attributes: ['id', 'name', 'email'],
    where: { email },
    raw: true
  })
    .then((user) => {
      if (user) return done(null, user)

      // 隨機生成密碼(8碼)
      const randomPwd = Math.random().toString(36).slice(-8)

      return bcrypt.hash(randomPwd, 10)
        .then((hash) => User.create({ name, email, password: hash }))
        .then((user) => done(null, { id: user.id, name: user.name, email: user.email }))
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


module.exports = passport