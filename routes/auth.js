const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");
const multer = require("multer");
const saltRounds = 10;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  }
});
const upload = multer({ storage: storage });

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res) => {
    try {
      console.log(req.user);

      const token = await jwt.sign({ _id: req.user._id }, "your_jwt_secret");
      res.status(200).send({ token });
    } catch (e) {
      console.log(e);
      res.status(500).send({
        internal: "500"
      });
    }
  }
);

router.post("/register", upload.single("file"), async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    console.log(req);
    if (user) {
      res.status(400).send({
        success: null,
        error: "Email is already registered"
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = await new userModel({
      email,
      hashedPassword
    });

    await newUser.save();

    res.status(200).send({
      success: "User Successfully registered",
      error: null
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      internal: "500"
    });
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/");
//   }
// );

router.get(
  "/verify",
  passport.authenticate("verifyToken", { session: false }),
  async (req, res) => {
    res.status(200).send(req.user);
  }
);

module.exports = router;
