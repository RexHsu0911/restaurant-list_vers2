const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const port = 3000

const db = require('./models')
const Restaurant = db.Restaurant

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
// 使用 body-parser 中間件來解析 URL 編碼的表單資料
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

// 顯示 restaurant 清單頁
app.get('/restaurants', (req, res) => {
  return Restaurant.findAll({
    raw: true
  })
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((err) => res.status(422).json(err))
})

// 搜尋 restaurant
app.get('/search', (req, res) => {
  const keywords = req.query.keyword?.trim()
  console.log('keywords:', keywords)
  if (!keywords) {
    return res.redirect('/restaurants')
  }

  Restaurant.findAll({
    raw: true
  })
    .then((restaurants) => {
      const filterRestaurant = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keywords.toLowerCase()) || restaurant.name_en.toLowerCase().includes(keywords.toLowerCase()) || restaurant.category.toLowerCase().includes(keywords.toLowerCase()) || restaurant.location.toLowerCase().includes(keywords.toLowerCase())
      })
      console.log(filterRestaurant)
      res.render('index', { restaurants: filterRestaurant, keywords })
    })
})

// 新增 restaurant 頁
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

// 新增 restaurant
app.post('/restaurants', (req, res) => {
  // 從 req.body 中獲取表單資料
  const formData = req.body
  console.log(formData)
  return Restaurant.create(formData, {
    raw: true
  })
    .then(() => {
      req.flash("success", "新增成功");
      res.redirect('/restaurants')
    })
    .catch((err) => console.log(err))
})

// 顯示 restaurant 項目頁
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  console.log('id:', req.params)
  return Restaurant.findByPk(id, {
    raw: true
  })
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch((err) => console.log(err))
})

// 更新 restaurant 頁
app.get('/restaurants/:id/edit', (req, res) => {
  res.send(`get restaurant edit form, id: ${req.params.id}`)
})

// 更新 restaurant
app.put('/restaurants/:id', (req, res) => {
  res.send(`restaurant id: ${req.params.id} has been modified`)
})

// 刪除 restaurant 
app.delete('/restaurants/:id', (req, res) => {
  res.send(`restaurant id: ${req.params.id} has been deleted`)
})

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`)
})