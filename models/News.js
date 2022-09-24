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
    poster: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        required: true,
        // ref: 'Reporter'
    }
    
})

const News = mongoose.model('News', schema)

module.exports = News