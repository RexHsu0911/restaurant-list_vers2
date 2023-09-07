const express = require('express')
const app = express()
const port = 3000

const db = require('./models')
const Restaurant = db.Restaurant

app.get('/', (req, res) => {
  res.send('hello world')
})

// 顯示 restaurant 清單頁
app.get('/restaurants', (req, res) => {
  return Restaurant.findAll()
    .then((restaurants) => res.send({ restaurants }))
    .catch((err) => res.status(422).json(err))
})

// 新增 restaurant 頁
app.get('/restaurants/new', (req, res) => {
  res.send('get restaurant form')
})

// 新增 restaurant
app.post('/restaurants/', (req, res) => {
  res.send('add restaurant')
})

// 顯示 restaurant 項目頁
app.get('/restaurants/:id', (req, res) => {
  res.send(`get restaurant, id: ${req.params.id}`)
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