var mongoose = require("mongoose");
var Loan = mongoose.model("Loan");
var User = mongoose.model("Users");

var JSONcallback = function(res, status, msg) {
  res.status(status);
  res.json(msg);
};
