var mongoose = require("mongoose");

// function debtByTime(start_date, end_date, payment_interval, payment_amount, principal_amount, interest_rate, type_interest, interest_on_debt)

// Schema representing a loan
var loanShema = new mongoose.Schema({
  loaner: {type: String, required: true},              // Loaner's username (pk)
  recipient: {type: String, required: true},           // Recipient's username (pk)
  dateIssued: {type: Date, "default": Date.now()},     // Date the loan was issued
  deadline: {type: Date, required: true},              // Date the loan must be repaid
  amount: {type: Number, required: true},              // Loan amount
  currency: {type: String, required: true},            // Loan currency
  interest: {type: Number, required: true},            // Interest rate (yearly)
  payment_interval: {type: Number, required: true},    // Payment interval (in days)
  payment_amount: {type: Number, required: true},      // Payment amount - amount payed in each repayment interval
  compoundInterest: {type: Boolean, "default": false},          // false ~ simple interest; true ~ interest on interest
  interest_on_debt: {type: Boolean, required: true},            // false ~ interest is computed using the total amount loaned (principal amount), true ~ interest is computed on the current debt
  status: {type: String, "default": "pending", required: true}  // pending, active, resolved
});


// Schema representing a contact
var contactSchema = new mongoose.Schema({
  name: {type: String, required: true},                  // Name of the contact
  surname: {type: String, required: true},               // Last name of the contact
  username: {type: String, required: true, unique: true}, // username of the contact (needed for linking with actual user)
  email: {type: String, required: true},                  // contact's email
  notes: {type: String}                   // notes associated with contact
});


// Schema representing a user
var userShema = new mongoose.Schema({                      
  name: {type: String, required: true},                   // name
  surname: {type: String, required: true},                // last name
  _id: {type: String, required: true, unique: true},      // username
  password: {type: String, required: true},               // password
  email: {type: String, required: true},                  // email
  gender: {type: String, required: true},                 // gender
  dateJoined: {type: Date, "default": Date.now()},        // date the user joined the app
  status: {type: Number, "default": 0},                   // 0 ~ activated_no; 1 ~ activated_yes; 2 ~ terminated
  defaultCurrency: {type: String, "default": "EUR"},      // user's default currency
  nightmode: {type: Boolean, "default": false},           // false ~ off; true ~ on
  loans: [loanShema],                                     // loans associated with user.
  contacts: [contactSchema]                               // user's contacts
});


// Compile the schema into a model.
// Name of model, schema to be used, optional name of the mongoDB collection
mongoose.model('User', userShema, 'Users');