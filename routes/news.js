const express = require('express')
const routes = express.Router()
const News = require('../models/News')

routes.post('/addNews', (req, res) => {
    const news = new News(req.body)
    news.save()
    .then(() => res.send(news)).catch(e => res.send(e))
})

module.exports = routes