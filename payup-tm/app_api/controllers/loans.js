var mongoose = require("mongoose");
var Loan = mongoose.model("Loan");

var JSONcallback = function(res, status, msg) {
  res.status(status);
  res.json(msg);
};

//exec has function(error, data)

module.exports.index = function(req, res){
  
  Loan.find().exec(function(err, data){
    JSONcallback(res, 200, data);
  });
}