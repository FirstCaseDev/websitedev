var express = require("express");
var app = express();
app.listen(5200, function () {
  console.log("server running on port 5200");
});

app.get("/spacytest/:text", (req, res) => {
  // using spawn instead of exec, prefer a stream over a buffer
  // to avoid maxBuffer issue
  console.log("hello");
  var text = req.params.text;
  var spawn = require("child_process").spawn;
  var process = spawn("python", ["./spacytest.py", text]);
  process.stdout.on("data", function (data) {
    console.log("process.stdout");
    res.send(data.toString());
  });
});

// function callD_alembert(req, res) {
//   // using spawn instead of exec, prefer a stream over a buffer
//   // to avoid maxBuffer issue
//   console.log("hello");
//   var spawn = require("child_process").spawn;
//   var process = spawn("python", ["./spacytest.py", req.body.text]);
//   process.stdout.on("data", function (data) {
//     console.log("process.stdout");
//     res.send(data.toString());
//   });
// }
