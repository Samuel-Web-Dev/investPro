
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    secondName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    confirmPassword: {
        type: String,
        required: true
    },
    accBalance: {
        type: String,
        required: true
    }, 
    registerDate: {
        type: String,
        required: true
    },
    activeInvestments: {
        type: String,
        required: true
    },
    recentDeposit: {
        type: Object,
        required: true
    },
    recentWithdrawal: {
        type: Object,
        required: true
    },
    recentInvestment: {
        type: Object,
        required: true
    },
    earningsOverview: {
        type: Array,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['investor', 'admin']
    }
})

module.exports = mongoose.model('User', userSchema)