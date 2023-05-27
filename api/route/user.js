const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

router.post("/sign_up", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    // Store hash in your password DB.
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      const user = new User({
        username: req.body.username,
        password: hash,
        phone: req.body.phone,
        email: req.body.email,
        userType: req.body.userType,
      });
      user
        .save()
        .then((result) => {
          res.status(200).json({
            msg: "Success",
            userCreated: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then((userResult) => {
      console.log(userResult[0].username);
      if (userResult.length < 1) {
        return res.status(403).json({
          Msg: "No User Found",
        });
      } else {
        bcrypt.compare(req.body.password, userResult[0].password, (err, result) => {
          if (!result) {
            return res.status(401).json({
              msg: "Wrong Password",
            });
          }
          if (result) {
            console.log(result)
            const token = jwt.sign(
              {
                username: userResult[0]?.username,
                userType: userResult[0]?.userType,
                email: userResult[0]?.email,
                phone: userResult[0]?.phone,
              },
              "secret ket",
              {
                expiresIn: "24hr",
              }
            );

            res.status(200).json({
              Msg: "User Found",
              result: {
                token: token,
                username: userResult[0]?.username,
                userType: userResult[0]?.userType,
                email: userResult[0]?.email,
                phone: userResult[0]?.phone,
              },
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
