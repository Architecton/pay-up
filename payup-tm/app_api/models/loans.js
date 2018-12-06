// Do not forget to add this sheme in db.js
var mongoose = require("mongoose");

// Schema representing a loan
var loanShema = new mongoose.Schema({
  loaner: {type: String, required: true},
  recipient: {type: String, required: true},
  dateIssued: {type: Date, "default": Date.now()},
  deadline: Date,
  amount: {type: Number, required: true},
  currency: {type: String, required: true},
  interest: {type: Number, required: true},
  compoundInterest: {type: Boolean, "default": false, required: true}, // false ~ simple interest; true ~ interest on interest
  status: {type: Number, "default": 0, required: true} // 0 ~ pending; 1 ~ active; 2 ~ resolved
});

mongoose.model('Loan', loanShema, 'Loans');