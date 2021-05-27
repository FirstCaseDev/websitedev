var express = require("express");
var app = express();
app.listen(8000, function () {
  console.log("server running on port 8000");
});
app.get("/dalembert", callD_alembert);
function callD_alembert(req, res) {
  // using spawn instead of exec, prefer a stream over a buffer
  // to avoid maxBuffer issue
  console.log("hello");
  var spawn = require("child_process").spawn;
  var process = spawn("python", [
    "./d_alembert.py",
    req.query.funds, // starting funds
    req.query.size, // (initial) wager size
    req.query.count, // wager count — number of wagers per sim
    req.query.sims, // number of simulations
  ]);
  process.stdout.on("data", function (data) {
    console.log("process.stdout");
    res.send(data.toString());
  });
}

// to send request copy ----> http://localhost:8000/dalembert?funds=100&size=10&count=100&sims=10
