const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A User must have a name!"],
    },
    email: {
      type: String,
      required: [true, "A user must have an Email!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid Email!"],
    },
    password: {
      type: String,
      required: [true, "A user must have a password!"],
      minlength: [8, "A password must contain at least 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (el) {
          return this.password === el;
        },
        message: "Passwords are not the same",
      },
    },
    role: {
      type: String,
      defualt: "user",
      enum: ["user", "admin", "guide", "lead-guide"],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpiresIn: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp; // 100 < 200
  }

  //false means password not changed which is by default
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
