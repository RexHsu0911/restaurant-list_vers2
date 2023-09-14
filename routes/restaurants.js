const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

// 顯示 restaurant 清單頁
router.get('/restaurants', (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = 9

  return Restaurant.findAll({
    raw: true
  })
    .then((restaurants) => {
      res.render('index', {
        restaurants: restaurants.slice((page - 1) * limit, page * limit),
        prev: page > 1 ? page - 1 : page,
        next: page + 1,
        page
      })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// 搜尋 restaurant
router.get('/search', (req, res, next) => {
  const keywords = req.query.keyword?.trim()
  // console.log('keywords:', keywords)
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
      // console.log(filterRestaurant)
      res.render('index', { restaurants: filterRestaurant, keywords })
    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// 新增 restaurant 頁
router.get('/restaurants/new', (req, res, next) => {
  return res.render('new')
})

// 新增 restaurant
router.post('/restaurants', (req, res, next) => {
  // 從 req.body 中獲取表單資料
  const formData = req.body
  // res.json(req.body)
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
router.get('/restaurants/:id', (req, res, next) => {
  const id = req.params.id
  // console.log('id:', req.params)
  return Restaurant.findByPk(id, {
    raw: true
  })
    .then((restaurant) => res.render('detail', { restaurant }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// 更新 restaurant 頁
router.get('/restaurants/:id/edit', (req, res, next) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    raw: true
  })
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
})

// 更新 restaurant
router.put('/restaurants/:id', (req, res, next) => {
  const formData = req.body
  const id = req.params.id
  return Restaurant.update(formData, { where: { id } })
    .then(() => {
      req.flash('success', '更新成功!')
      return res.redirect(`/restaurants/${id}`)
    })
    .catch((error) => {
      error.errorMessage = '更新失敗:('
      next(error)
    })
})

// 刪除 restaurant
router.delete('/restaurants/:id', (req, res, next) => {
  const id = req.params.id
  return Restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功!')
      return res.redirect('/restaurants')
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
})

module.exports = router
