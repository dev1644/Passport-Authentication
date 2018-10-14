const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

require("./services/passport");

mongoose.connect("mongodb://localhost/practice"); // Make a Connection

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const auth = require("./routes/auth");

// router.post("/fileUpload", upload.single("image"), (req, res, next) => {
//   insertDocuments(db, "public/images/uploads/" + req.file.filename, () => {
//     db.close();
//     res.json({ message: "File uploaded successfully" });
//   });
// });

app.use("/api", auth);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "api/auth/login",
    session: false
  }),
  function(req, res) {
    res.redirect("/");
  }
);
app.get("/", (req, res) => {
  console.log("I am alive");
  res.status(200).send("I am Alive");
});
// app.use('/user', passport.authenticate('jwt', {session: false});

app.listen(5000);
