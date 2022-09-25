const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 4,
        required: true
    },
    description: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: 'images/news.jpg'
    },
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Reporter'
    }

})

const News = mongoose.model('News', schema)

module.exports = News