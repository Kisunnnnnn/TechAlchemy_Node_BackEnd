const express = require('express')
const router = express.Router()
const { saveUsers, login, getNews, getWeather, sortNumbers } = require('../controllers/data')

router.post('/signup', saveUsers)
router.post('/login', login)
router.get('/news', getNews)
router.get('/weather', getWeather)
router.get('/sort', sortNumbers)
module.exports = router