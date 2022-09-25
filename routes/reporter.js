const express = require('express')
const routes = express.Router()
const Reporter = require('../models/Reporter')
const auth = require('../middlewares/auth')
const multer = require('multer')

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
    res.send(req.reporter)
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

routes.delete('/profile', auth, async (req, res) => {
    try {
        const reporter = await Reporter.findByIdAndRemove(req.reporter._id)
        if (!reporter) return res.send('Not have a reporter by this ID')
        await reporter.save()
        res.send(reporter)
    } catch (e) {
        res.send(e)
    }
})

const upload = multer({
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|png|jpeg|jfif)$/)) {
            return callback(new Error("Please upload file extentions (jpg, jpeg, png, jfif) only"), null)
        }
        callback(null, true)
    }
})

routes.post('/uploadImage', auth, upload.single('images'), (req, res) => {
    req.reporter.personalPicture = req.file.buffer
    req.reporter.save()
        .then(() => res.send('Uploaded Successfully'))
        .catch(e => res.send(e))
})


module.exports = routes