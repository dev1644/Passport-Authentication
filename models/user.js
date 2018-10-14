const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: false, unique: false },
  hashedPassword: { type: String, required: false },
  googleId: String,
  img: { type: String, data: Buffer }
  //   wallet: { type: Object, required: true }
});

module.exports = mongoose.model("User", UserSchema);
