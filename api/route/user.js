const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dlxuxs9zv",
  api_key: "282254611379566",
  api_secret: "zkeN0j1NdZ62h9Eh59uxeufMSvw",
  secure: true,
});

// await Character.findOneAndUpdate(filter, update);
router.post("/updateImgPath", (req, res, next) => {
  const file = req.files.photo;

  console.log(req.body);

  cloudinary.uploader.upload(file?.tempFilePath, (result, error) => {
    if (result) {
      console.log(result.url)
      const user = User.findOneAndUpdate(
        { username: req.body.username },
        { imgPath: result.url }
      )
        .then((result) => {
          res.status(200).json({
            msg: "Success",
            userUpdated: user,
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    } else {
      console.log(error);
    }
  });
});

router.post("/sign_up", (req, res, next) => {
  const file = req.files.photo;

  console.log(req.body);
  try {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        const getDate = new Date();
        cloudinary.uploader.upload(file?.tempFilePath, (result, error) => {
          if (result) {
            const user = new User({
              username: req.body.username,
              password: hash,
              phone: req.body.phone,
              email: req.body.email,
              name: req.body.name,
              jobTitle: req.body.jobTitle,
              organization: req.body.organization,

              userType: req.body.userType,
              imgPath: result.url,
              joinDate: getDate.toString(),
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
          } else {
            console.log(err);
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
  }
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
        bcrypt.compare(
          req.body.password,
          userResult[0].password,
          (err, result) => {
            if (!result) {
              return res.status(401).json({
                msg: "Wrong Password",
              });
            }
            if (result) {
              console.log(result);
              const token = jwt.sign(
                {
                  username: userResult[0]?.username,
                  userType: userResult[0]?.userType,
                  name: userResult[0]?.name,
                  jobTitle: userResult[0]?.jobTitle,
                  organization: userResult[0]?.organization,
                  email: userResult[0]?.email,
                  phone: userResult[0]?.phone,
                  imgPath: userResult[0]?.imgPath,
                  joinDate: userResult[0]?.joinDate,
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
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
