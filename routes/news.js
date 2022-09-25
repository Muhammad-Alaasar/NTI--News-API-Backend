const e = require('express')
const express = require('express')
const routes = express.Router()

const auth = require('../middlewares/auth')
const News = require('../models/News')

routes.post('/addNews', auth, (req, res) => {
    const news = new News({ ...req.body, poster: req.reporter._id })
    news.save()
        .then(() => res.send(news))
        .catch(e => res.send(e))
})

routes.get('/myNews', auth, (req, res) => {
    req.reporter.populate('news')
        .then(data => {
            if (!data) return res.send("You don't have any news")
            res.send(data)
        }).catch(e => res.send(e))
})

routes.get('/allNews', auth, (req, res) => {
    News.find({})
        .then(data => {
            if (!data.length) return res.send('Not found any News!')
            res.send(data)
        }).catch(e => res.send(e))
})

routes.get('/news/:id', auth, (req, res) => {
    News.findById(req.params.id)
        .then(data => {
            if (!data) return res.send('No News has this ID')
            res.send(data)
        }).catch(e => res.send(e))
})

routes.patch('/news/:id', auth, (req, res) => {
    News.findOneAndUpdate({ _id: req.params.id, poster: req.reporter._id }, req.body, {
        new: true,
        runValidators: true
    }).then(data => {
        if (!data) return res.send('You can\'t MODIFY this News')
        res.send(data)
    }).catch(e => res.send(e))
})

routes.delete('/news/:id', auth, (req, res) => {
    News.findOneAndDelete({ _id: req.params.id, poster: req.reporter._id })
        .then(data => {
            if (!data) return res.send('You can\'t DELETE this News')
            res.send(data)
        }).catch(e => res.send(e))
})

module.exports = routes