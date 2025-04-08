const express = require('express')

const routes = express.Router()
const isAuth = require('../middleware/is-auth')
const adminController = require('../controllers/admin')

 function checkRole(roles) {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            res.status(403).json({message: 'Access Denied'})
        }
        next()
    }
 }


 routes.get('/dashboard', isAuth, checkRole('admin'), adminController.getUsersData)

 routes.get('/dashboard/:userId', isAuth, checkRole('admin'), adminController.getUserData)

 routes.put('/dashboard/update/:id', isAuth, checkRole('admin'), adminController.updateData)


 module.exports = routes