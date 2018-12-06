var mongoose = require("mongoose");

// Schema representing a loan
var loanShema = new mongoose.Schema({
  loaner: {type: String, required: true},           // Loaner's username (pk)
  recipient: {type: String, required: true},        // Recipient's username (pk)
  dateIssued: {type: Date, "default": Date.now()},  // Date the loan was issued
  deadline: {type: Date, required: true},           // Date the loan must be repaid
  amount: {type: Number, required: true},           // Loan amount
  currency: {type: String, required: true},         // Loan currency
  interest: {type: Number, required: true},         // Interest rate (yearly)
  compoundInterest: {type: Boolean, "default": false, required: true}, // false ~ simple interest; true ~ interest on interest
  status: {type: Number, "default": 0, required: true} // 0 ~ pending; 1 ~ active; 2 ~ resolved
});

// TODO
// Schema representing a contact
var contactSchema = new mongoose.Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  gender: {type: String, required: true},
  dateJoined: {type: Date, "default": Date.now()},
  status: {type: Number, "default": 0},                  // 0 ~ activated_no; 1 ~ activated_yes; 2 ~ terminated
  proDefauld: {type: Boolean, "default": false},         // false ~ default; true ~ pro
  defaultCurrency: {type: String, "default": "EUR"},
  nightmode: {type: Boolean, "default": false}           // false ~ off; true ~ on
});

// Schema representing a user
var userShema = new mongoose.Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  gender: {type: String, required: true},
  dateJoined: {type: Date, "default": Date.now()},
  status: {type: Number, "default": 0},                  // 0 ~ activated_no; 1 ~ activated_yes; 2 ~ terminated
  proDefauld: {type: Boolean, "default": false},         // false ~ default; true ~ pro
  defaultCurrency: {type: String, "default": "EUR"},
  nightmode: {type: Boolean, "default": false}           // false ~ off; true ~ on
  // TODO avatar: {type: Buffer, "defa"}
});




// Compile the schema into a model.
// Name of model, schema to be used, optional name of the mongoDB collection
mongoose.model('User', userShema, 'Users');