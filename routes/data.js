const express = require('express')
const router = express.Router()
const { saveUsers, login, getNews, getWeather } = require('../controllers/data')

router.post('/signup', saveUsers)
router.post('/login', login)
router.get('/news', getNews)
router.get('/weather', getWeather)
module.exports = router