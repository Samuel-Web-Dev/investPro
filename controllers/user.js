const bcrypt = require('bcryptjs')

const User = require('../models/user')


exports.investorDashboard = (req, res, next) => {
    User.find({ _id: req.user._id }).then((user) => {
      if(!user) {
        const error = new Error('User not found')
        error.statusCode = 400
        return next(error)
      }

      return res.json({message: 'Get Investor Dashboard', userData: user})
    }).catch(err => {
        console.log(err);

        next(err)
        
    })
}


exports.updateData = (req, res, next) => {
  const userId = req.params.userId;
  const { name, email, currentPassword, newPassword, confirmPassword } = req.body;

  console.log(name, email)

  if (!userId) {
    const error = new Error('Unable to find User');
    error.statusCode = 404;
    return next(error);
  }

  if (newPassword && newPassword !== confirmPassword) {
    const error = new Error("New passwords do not match");
    error.statusCode = 400;
    return next(error);
  }

  User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      // Verify current password first
      return bcrypt.compare(currentPassword, user.password)
        .then(doMatch => {
          if (!doMatch) {
            const error = new Error("Current password is incorrect");
            error.statusCode = 401;
            throw error;
          }

          // Handle password update if newPassword exists
          if (newPassword) {
            return bcrypt.hash(newPassword, 12)
              .then(hashedPassword => {
                // Update both name and password
                return User.findByIdAndUpdate(
                  userId,
                  { 
                    firstName: name,
                    email: email,
                    password: hashedPassword,
                    confirmPassword: confirmPassword
                  },
                  { new: true }
                ).select('-password -confirmPassword',);
              });
          } else {
            // Update only name
            return User.findByIdAndUpdate(
              userId,
              { firstName: name, email: email },
              { new: true }
            ).select('-password');
          }
        });
    })
    .then(updatedUser => {
      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};