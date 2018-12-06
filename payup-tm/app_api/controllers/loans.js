var mongoose = require("mongoose");

/* 
To use our schema definition, we need to convert our blogSchema into a Model we can work with. 
To do so, we pass it into mongoose.model(modelName, schema)
*/
var Loan = mongoose.model("Loan");

// callback function that sets status and msg to res.
var JSONcallback = function(res, status, msg) {
  res.status(status);
  res.json(msg);
};

/*
The module.exports or exports is a special object which is included in every JS file 
in the Node.js application by default. module is a variable that represents current module 
and exports is an object that will be exposed as a module. So, whatever you assign to 
module.exports or exports, will be exposed as a module.
*/

/*
module.exports is the object that's actually returned as 
the result of a require call.
*/

// exec has function(error, data)
module.exports.index = function(req, res) {
  // Get all loans. return data as msg in callback function.
  Loan.find().exec(function(err, data) {
    if(err) {
      JSONcallback(res, 400, err);
    } else {
      JSONcallback(res, 200, data);
    }
  });
}

// Pretvori v JSON
var JSONresponse = function(response, status, content) {
  response.status(status);
  response.json(content);
};


// Function for creating a new Loan schema in the database using an API call.
// request contains the loan object in JSON format.
// Return successfuly created loan.
module.exports.loansCreate = function(request, response) {
  Loan.create({
    "loaner": [{
        "name": "Jozef",
        "surname": "Novak",
        "username": "gozdnijoza97",
        "password": "jozef123",
        "email": "joze.novak@email.com",
        "gender": true,
        "date": "2018-11-15",
        "status": 1,
        "proDefauld": true,
        "defaultCurrency": "EUR",
        "nightmode": false
    }],
    "recipient": [{
        "name": "Miha",
        "surname": "Gorenc",
        "username": "mihazgore96",
        "password": "mihec123",
        "email": "miha.gorenc@email.com",
        "gender": true,
        "date": "2018-10-14",
        "status": 1,
        "proDefauld": false,
        "defaultCurrency": "EUR",
        "nightmode": false
    }],
    "dateIssued": "2018-12-05",
    "deadline": "2018-12-15",
    "amount": "100",
    "currency": "EUR",
    "interest": "0.05",
    "compoundInterest": false,
    "status": 1
  }, function(napaka, loan){
    if (napaka) {
      JSONresponse(response, 400, napaka);
    } else {
      JSONresponse(response, 201, loan);
    }
  });
};