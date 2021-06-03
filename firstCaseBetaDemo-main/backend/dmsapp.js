const express = require("express");
const app = express();
var port = process.env.PORT || 7200;

var User = require("./db/models/user");
var jwt = require("njwt");

// Load in the mongoose models
const bodyParser = require("body-parser");
require("dotenv/config");

// This file will handle connection logic to the MongoDB database

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_DB, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB successfully :)");
  })
  .catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
  });

// To prevent deprecation warnings (from MongoDB native driver)
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

//Connect to mongoDB
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .catch((error) => console.log(error));

app.use(express.json());

app.listen(port, () => console.log("Server started on " + port));

// User Registration
app.post("/api/dms/users", (req, res) => {
  var user = new User();
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  user.name = req.body.name;
  user.organisation = req.body.organisation;
  user.position = req.body.position;
  if (
    req.body.username == null ||
    req.body.username == "" ||
    req.body.email == null ||
    req.body.email == "" ||
    req.body.password == null ||
    req.body.password == "" ||
    req.body.name == null ||
    req.body.name == ""
  ) {
    res.json({
      success: false,
      msg: "Fields required",
    });
  } else {
    user.save((error) => {
      if (error) {
        res.json({
          success: false,
          msg: error,
        });
      } else {
        res.json({
          success: true,
          msg: "User created",
        });
      }
    });
  }
});

// User Login Complete
app.post("/api/dms/authenticate", function (req, res) {
  User.findOne({ username: req.body.username })
    .select("email username password")
    .exec(function (err, user) {
      if (err) {
        res.json({ success: false, msg: err });
      } else {
        if (!user) {
          res.json({
            success: false,
            message: "Could not authenticate user",
          });
        } else if (user) {
          if (req.body.password) {
            var validPassword = user.comparePassword(req.body.password);
            //res.send(console.log(validPassword));
            if (!validPassword) {
              res.json({ success: false, msg: "Wrong credentials" });
              return;
            } else {
              var claims = {
                iss: "https://localhost:4200/",
                // iss: "https://firstcase.io/", // The URL of your service
                sub: "users/" + user.username, // The UID of the user in your system
              };
              var token = jwt.create(claims, process.env.SECRET);
              var curr_time = new Date().getTime();
              token.setExpiration(curr_time + 30 * 60 * 1000);

              // token = jwt.sign({ username: user.username, email: user.email },
              //     process.env.SECRET,
              //     {expiresIn: "30s"}
              // );
              res.json({
                success: true,
                msg: "Successfully logged in",
                exp: token.body.exp * 1000,
                username: user.username,
              });
              return;
            }
          } else {
            res.json({ success: false, msg: "Fields required" });
            return;
          }
        }
      }
    });
});

app.get("/api/dms/users/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.send(error);
    });
});
