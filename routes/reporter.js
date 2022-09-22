const express = require('express')
const routes = express.Router()
const Reporter = require('../models/Reporter')
const auth = require('../middlewares/auth')

routes.post('/addReporter', (req, res) => {
    const reporter = new Reporter(req.body)
    reporter.save().then(() => {
        const token = reporter.generateToken()
        res.send({ reporter, token })
    }).catch(e => res.send(e))
})

routes.get('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const reporter = await Reporter.findByCredentials(email, password)
        const token = reporter.generateToken()
        res.send({ reporter, token })
    } catch (e) {
        res.send(e.message)
    }
})

routes.get('/profile', auth, (req, res) => {
    Reporter.findById(req.reporter._id)
        .then((reporter) => res.send(reporter))
        .catch(e => res.send(e))
})

routes.patch('/profile', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const reporter = await Reporter.findById(req.reporter._id)
        if (!reporter) return res.send('Please login to view your profile!')
        updates.forEach(i => reporter[i] = req.body[i])
        await reporter.save()
        res.send(reporter)
    } catch (e) {
        res.send(e)
    }
})

module.exports = routes