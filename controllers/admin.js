const User = require('../models/user')

exports.getUsersData = (req, res, next) => {
    User.find({role: 'investor'}).then(users => {
        return res.json({message: 'Users Data', users: users})
    }).catch(err => {
        console.log(err)
        next(err)
    })
}

exports.getUserData = (req, res, next) => {
    const userId = req.params.userId
     
    if(!userId) {
        const error = new Error('Unable to find User')
        error.statusCode = 404 
        next(error)
    }

  User.findById(userId).then((user) => {
    return res.json({message: 'Single User', user: user})
  }).catch(err => {
    console.log(err)
    next(err)
  })
}


exports.updateData = (req, res, next) => {
  const userId = req.params.id
  
  const accBalance = req.body.accBalance
  const activeInvestments = req.body.activeInvestments
  const recentDeposit = req.body.recentDeposit
  const recentWithdrawal = req.body.recentWithdrawal
  const recentInvestment = req.body.recentInvestment
  const earningsOverview = req.body.earningsOverview

  if(!userId) {
    const error = new Error('Unable to find User')
    error.statusCode = 404 
    next(error)
}

 User.findById(userId).then(user => {
  if(!user) {
    const error = new Error('User not found')
    error.statusCode = 400
    throw error
  }

  user.accBalance = accBalance
  user.activeInvestments = activeInvestments
  user.recentDeposit = recentDeposit
  user.recentWithdrawal = recentWithdrawal
  user.recentInvestment = recentInvestment
  user.earningsOverview = earningsOverview

  return user.save()
 }).then((user => {
  console.log(user)
   return res.json({message: 'User Updated Successfully', user: user})
 })).catch(err => {
  console.log(err)
  next(err)
 })
}