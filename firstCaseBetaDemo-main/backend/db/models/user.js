var mongoose = require("mongoose"); // Import Mongoose Package
var Schema = mongoose.Schema; // Assign Mongoose Schema function to variable
var bcrypt = require("bcrypt-nodejs"); // Import Bcrypt Package

// User Mongoose Schema
var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // select: false,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  organisation: {
    type: String,
    required: false,
  },
  position: {
    type: String,
    required: false,
  },
});

// Middleware to ensure password is encrypted before saving user to database
UserSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next(); // If password was not changed or is new, ignore middleware

  // Function to encrypt password
  bcrypt.hash(user.password, null, null, function (err, hash) {
    if (err) return next(err); // Exit if error is found
    user.password = hash; // Assign the hash to the user's password so it is saved in database encrypted
    next(); // Exit Bcrypt function
  });
});

// Method to compare passwords in API (when user logs in)
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password); // Returns true if password matches, false if doesn't
};

module.exports = mongoose.model("User", UserSchema); // Export User Model for us in API
