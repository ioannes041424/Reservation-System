const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    hash_password: {
      type: String,
      required: true,
    },
    isGoogleAccount: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Method to authenticate the password
userSchema.method({
  async authenticate(password) {
    return bcrypt.compare(password, this.hash_password);
  },
});

module.exports = mongoose.model("Student", userSchema);  