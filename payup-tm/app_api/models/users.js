var mongoose = require("mongoose");

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
});

// Compile the schema into a model.
// Name of model, schema to be used, optional name of the mongoDB collection
mongoose.model('User', userShema, 'Users');