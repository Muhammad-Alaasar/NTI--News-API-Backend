const jwt = require('jsonwebtoken')
const Reporter = require('../models/Reporter')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const verifyToken = jwt.verify(token, (process.env.SECRET_KEY || 'newsAPI'))
        const reporter = await Reporter.findById({ _id: verifyToken._id })
        req.reporter = reporter
        next()
    } catch (e) {
        res.send('You have an error in the Authentication')
    }
}

module.exports = auth