const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value) {
            if (!validator.isStrongPassword(value)) throw new Error('Please use Strong Password')
        }
    },
    age: {
        type: Number,
        trim: true,
        minlength: 2,
        validate(value) {
            if (value <= 0) throw new Error("Invalid Age")
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Invalid Email")
        }
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 11,
        validate(value) {
            if (!validator.isMobilePhone(value, 'ar-EG')) throw new Error('Please enter an egyptian phone number')
        }
    },
    personalPicture: {
        type: Buffer
    }
})

schema.virtual('news', {
    localField: '_id',
    foreignField: 'poster',
    ref: 'News'
})

schema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 8)
    }
})

schema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id.toString() }, (process.env.SECRET_KEY || 'newsAPI'))
}

schema.statics.findByCredentials = async (email, password) => {
    const reporter = await Reporter.findOne({ email })
    if (!reporter) throw new Error("Please recheck your email or password")

    const isMatch = await bcryptjs.compare(password, reporter.password)
    if (!isMatch) throw new Error("Please recheck your email or password")

    return reporter
}

const Reporter = mongoose.model('Reporter', schema)

module.exports = Reporter