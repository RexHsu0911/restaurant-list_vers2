const express = require('express')
const app = express()
const port = 3000

const db = require('./models')
const Restaurant = db.Restaurant

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/restaurants', (req, res) => {
  return Restaurant.findAll()
    .then((restaurants) => res.send({ restaurants }))
    .catch((err) => res.status(422).json(err))
})

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`)
})