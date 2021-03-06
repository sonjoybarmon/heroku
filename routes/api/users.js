const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// JWT secret
// const keys = require("../../config/keys");

// Load User model
const User = require("../../models/User");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @ route      POST api/users/register
// @ desc       Register user
// @ access     Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default picture
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
        portfolio: {
          currencyArray: [],
          walletValue: 0,
          walletDifference: 0,
          myCoins: []
        }
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @ route      POST api/users/login
// @ desc       Login a user / Returning a token
// @ access     Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email,
    password = req.body.password;

  // Find user by email
  // * ({ email }) is the same as ({email: req.body.email})
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check password
    bcrypt
      .compare(password, user.password)
      // isMatch is a boolean value
      .then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT payload
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            portfolio: user.portfolio
          };
// keys.secret
          // Sign token
          jwt.sign(payload, "8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb", { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          });
        } else {
          errors.password = "Wrong password";
          return res.status(400).json(errors);
        }
      });
  });
});

// @route     POST api/users/update-portfolio
// @desc      Update user's portfolio
// @access    Private
router.post(
  "/update-portfolio",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get updated portfolio data
    const updatedPortfolio = req.body;
    const id = req.user.id;

    User.findByIdAndUpdate(id, { portfolio: updatedPortfolio })
      .then(user => res.json(user))
      .catch(err => console.log(err));
  }
);

module.exports = router;
