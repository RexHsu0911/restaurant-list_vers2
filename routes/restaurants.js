const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

// 顯示 restaurant 清單頁(分頁)
router.get('/', (req, res, next) => {
  console.log('session:', req.session)
  console.log(req.user)
  const userId = req.user.id
  const page = parseInt(req.query.page) || 1
  const limit = 9

  return Restaurant.findAndCountAll({
    where: { userId },
    offset: (page - 1) * limit,
    limit,
    // order: sortCase,
    raw: true
  })
    .then((restaurants) => {
      const totalPages = Math.ceil(restaurants.count / limit)
      // Array.from()可以利用箭頭函數產生一組陣列，第一個參數傳入一個object (totalPages)，內容包含長度length，第二個參數利用箭頭函數表示執行 map 函數來產生陣列
      const eachPages = Array.from({ length: totalPages }).map((item, index) => index + 1)
      // console.log(restaurants)

      res.render('index', {
        // order,
        restaurants: restaurants.rows,
        prev: page > 1 ? page - 1 : page,
        next: totalPages > page ? page + 1 : totalPages,
        page,
        eachPages
      })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// 顯示 restaurant 清單頁(搜尋)
router.get('/search', (req, res, next) => {
  const keywords = req.query.keyword?.trim()
  const userId = req.user.id
  // console.log('keywords:', keywords)
  if (!keywords) {
    return res.redirect('/restaurants')
  }

  Restaurant.findAll({
    where: { userId },
    raw: true
  })
    .then((restaurants) => {
      const filterRestaurant = restaurants.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keywords.toLowerCase()) || restaurant.name_en.toLowerCase().includes(keywords.toLowerCase()) || restaurant.category.includes(keywords)
      })
      // console.log(filterRestaurant)
      res.render('index', { restaurants: filterRestaurant, keywords })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// 顯示 restaurant 清單頁(分類)
router.get('/', (req, res, next) => {
  const userId = req.user.id
  const sort = req.query.sort || 'A'

  const sortCase = function sortCase (sort) {
    switch (sort) {
      case 'A':
        return [['name_en', 'ASC']]
      case 'Z':
        return [['name_en', 'DESC']]
      case '類別':
        return [['category']]
      case '地區':
        return [['location']]
      default:
        return [[]]
    }
  }
  // console.log(sort)
  // console.log(sortCase(sort))

  return Restaurant.findAll({
    where: { userId },
    order: sortCase(sort),
    raw: true
  })
    .then((restaurants) => {
      const selectedOrder = function (value, selectedValue) {
        console.log(value)
        return selectedValue === value ? 'selected' : ''
      }
      res.render('index', { restaurants, selectedOrder })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// 新增 restaurant 頁
router.get('/new', (req, res, next) => {
  const userId = req.user.id

  return Restaurant.findAll({
    where: { userId },
    raw: true
  })
    .then((restaurant) => res.render('new', { restaurant }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// 新增 restaurant
router.post('/', (req, res, next) => {
  // 從 req.body 中獲取表單資料
  const formData = req.body
  const userId = req.user.id
  // 將 userId 添加到 formData 中
  formData.userId = userId
  // console.log(formData)

  return Restaurant.create(formData)
    .then(() => {
      req.flash('success', '新增成功!')
      return res.redirect('/restaurants')
    })
    .catch((error) => {
      error.errorMessage = '新增失敗:('
      next(error)
    })
})

// 顯示 restaurant 項目頁
router.get('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id
  // console.log('id:', req.params)

  return Restaurant.findByPk(id, {
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (restaurant.userId !== userId) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      res.render('detail', { restaurant })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// 更新 restaurant 頁
router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Restaurant.findByPk(id, {
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (restaurant.userId !== userId) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      const category = restaurant.category
      // Handlebars.registerHelper 是 Handlebars.js 模板引擎中的一個方法
      // 用於註冊自定義的 Handlebars 輔助函數（helper functions）
      const selectedCategory = function (value) {
        // console.log(value)
        return value === category
      }
      res.render('edit', { restaurant, selectedCategory })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// 更新 restaurant
router.put('/:id', (req, res, next) => {
  const formData = req.body
  const id = req.params.id
  const userId = req.user.id

  return Restaurant.findByPk(id, {
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (restaurant.userId !== userId) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      return Restaurant.update(formData, { where: { id } })
        .then(() => {
          req.flash('success', '更新成功!')
          return res.redirect(`/restaurants/${id}`)
        })
    })
    .catch((error) => {
      error.errorMessage = '更新失敗:('
      next(error)
    })
})

// 刪除 restaurant
router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Restaurant.findByPk(id, {
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      if (restaurant.userId !== userId) {
        req.flash('error', '找不到資料')
        return res.redirect('/restaurants')
      }

      return Restaurant.destroy({ where: { id } })
        .then(() => {
          req.flash('success', '刪除成功!')
          return res.redirect('/restaurants')
        })
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
})

module.exports = router
