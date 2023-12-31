const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')


if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
// console.log('SESSION_SECRET:', process.env.SESSION_SECRET)

// 引用路由器
const router = require('./routes')
// passport 要引用環境變數，需放在 env 之後
const passport = require('./config/passport')
const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
// 使用 body-parser 中間件來解析 URL 編碼的表單資料
app.use(bodyParser.urlencoded({
  extended: true,
  helpers: require('./routes/restaurants')
}))
// 支援 json
app.use(bodyParser.json())
app.use(methodOverride('_method'))

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

// 實做登入流程
app.use(passport.initialize())
// 使用 session 作為驗證的資料來源，登入後保持登入狀態
app.use(passport.session())

app.use(messageHandler)
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`)
})
