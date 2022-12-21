const Users = require('../collections/user')
const bcrypt = require('bcrypt')
const moment = require('moment')
const fs = require('fs')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const saveUsers = async (req, res) => {
    try {
        let error = false, message = ""
        const user = {
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: req.body.password
        }
        if (!user.name || !user.email || !user.password) {
            return res.status(400).json({
                error: true,
                message: "Please fill all the details"
            })
        }
        const checkIfExists = await Users.findOne({ email: user.email })
        if (checkIfExists === null || checkIfExists === "") {
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
            const User = new Users(user)
            const saveUser = await User.save()
            error = false
            message = "User Added"

        }
        else {
            error = true
            message = "Email already exists"
        }
        res.status(200).json({
            error,
            message
        })

    }
    catch (err) {
        res.status(400).json({
            error: true,
            message: "Something went wrong", err
        })
    }
}
const login = async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                error: true,
                message: "Please enter all the details"
            })
        }
        const user = await Users.findOne({ email })
        if (!user) {
            return res.json({
                error: true,
                message: "No such user exists",
                data: ""
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {

            return res.status(400).json({
                error: true,
                message: "Invalid Credentials",
                data: ""
            })
        }
        res.status(200).json({
            error: false,
            message: "User logged in",
            data: {
                "name": user.name,
                "email": user.email
            }
        })
    }
    catch (err) {
        res.status(400).json({
            error: true,
            message: "Something went wrong"
        })
    }
}
const getNews = async (req, res) => {
    try {
        let newsData = {
            "count": "",
            data: []
        }
        const options = {
            method: 'GET'
        };
        const result = await fetch('https://newsapi.org/v2/everything?q=crypto&from=2022-12-20&sortBy=publishedAt&apiKey=b79fa2cf3d64411890b99497deb5f5aa', options)
        const data = await result.json()
        newsData["count"] = data.articles.length
        for (let i = 0; i < data.articles.length; i++) {
            newsData.data.push({ "headline": data.articles[i].title, "link": data.articles[i].url })
        }
        res.json({
            error: false,
            message: "Data has been sent",
            data: newsData
        })


    }
    catch (err) {
        res.json({
            error: true,
            message: "Something went wrong",
            data: ""
        })
    }
}
const getWeather = async (req, res) => {
    try {
        let WeatherData = {
            "count": "",
            "unit": "",
            "location": "",
            data: []
        }
        const options = {
            method: 'GET'
        };
        const result = await fetch('http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=4ccdd1f4db864410263e0492f64cbb0d&units=metric', options)
        const data = await result.json()

        WeatherData["count"] = data.cnt
        WeatherData["unit"] = "metric"
        WeatherData["location"] = "London"


        for (let i = 0; i < data.list.length; i++) {
            WeatherData.data.push({ "date": moment(data.list[i]['dt_txt']).format('ddd MMMM D YYYY'), "main": data.list[i].weather[0]['main'], "temp": data.list[i].main['temp'] })
        }

        res.json({
            error: false,
            message: "Data has been sent",
            data: WeatherData
        })

    }
    catch (err) {
        res.json({
            error: true,
            message: "Something went wrong",
            data: ""
        })
    }
}
function sortNumbers_func(array) {
    let completed = false
    while (!completed) {
        completed = true
        for (let i = 0; i < array.length; i++) {
            console.log("--" + i)
            if (array[i - 1] > array[i]) {
                completed = false
                var temp = array[i - 1]
                array[i - 1] = array[i]
                array[i] = temp
            }
        }
    }
    return array;
}
const sortNumbers = (req, res) => {
    try {
        const data = fs.readFileSync('./numbers.txt', 'utf8')
        const numbers = data.split(",")
        const converted = numbers.map((num) => {
            return parseInt(num, 10)
        })
        res.status(200).json({
            error: false,
            message: "",
            data: sortNumbers_func(converted),
            original: numbers
        })
    }
    catch (err) {
        res.status(400).json({
            error: true,
            message: "Something went wrong",
            data: ""
        })
    }
}

module.exports = {
    saveUsers,
    login,
    getNews,
    getWeather,
    sortNumbers
}