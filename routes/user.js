const express = require('express')

const routes = express.Router()
const isAuth = require('../middleware/is-auth')
const investorController = require('../controllers/user')

 function checkRole(roles) {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            res.status(403).json({message: 'Access Denied'})
        }
        next()
    }
 }

routes.get('/dashboard', isAuth, checkRole('investor'), investorController.investorDashboard)

routes.put('/dashboard/account_setting/:userId', isAuth, checkRole('investor'), investorController.updateData)

module.exports = routes