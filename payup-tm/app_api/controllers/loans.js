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

// Pretvori v JSON
var vrniJsonOdgovor = function(odgovor, status, vsebina) {
  odgovor.status(status);
  odgovor.json(vsebina);
};

// Funkcija za kreiranje nove LOAN sheme v bazi z api klicem
module.exports.loansKreiraj = function(zahteva, odgovor) {
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
      vrniJsonOdgovor(odgovor, 400, napaka);
    } else {
      vrniJsonOdgovor(odgovor, 201, loan);
    }
  });
};