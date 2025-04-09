const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const firstName = req.body.firstName;
  const secondName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (password !== confirmPassword) {
    return res.json({ message: "Password does not match" });
  }

  const date = new Date().toISOString()
  const modifiedDate = date.split('T')[0]

  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        firstName: firstName,
        secondName: secondName,
        email: email,
        password: hashedPass,
        confirmPassword: confirmPassword,
        accBalance: "0",
        activeInvestments: "0",
        recentDeposit: { amount: "0", date: "2024-03-18" },
        recentWithdrawal: { amount: "0", date: "2024-03-18" },
        recentInvestment: { amount: "0", date: "2024-03-18" },
        registerDate: modifiedDate,
        earningsOverview: [
          { name: "Jan", amount: 2400 },
          { name: "Feb", amount: 1398 },
          { name: "Mar", amount: 9800 },
          { name: "Apr", amount: 3908 },
          { name: "May", amount: 4800 },
          { name: "Jun", amount: 3800 },
        ],
        role: "investor",
      });
      return user.save();
    })
    .then((user) => {
      res
        .status(200)
        .json({ message: "Account created successfully", userInfo: user });
    })
    .catch((err) => {
      console.log(err);
      throw new Error("Error Occured");
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User with this email could not be found");
        error.status = 401;
        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((doMatch) => {
      if (!doMatch) {
        const error = new Error("Password is Incorrect");
        error.status = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          user: loadedUser,
          userId: loadedUser._id,
        },
        "this_is_simplex_secret_key",
        { expiresIn: "3h" }
      );

      return res.json({
        message: "Login successful",
        token: token,
        user: loadedUser,
      });
    })
    .catch((err) => {
      console.log("Error Occured on server", err.message);
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};
