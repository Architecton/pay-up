var mongoose = require('mongoose');
var User = mongoose.model('User');

// getJsonResponse: take response, status and JSON data and add status and data to response.
var getJsonResponse = function(response, status, data) {
  // Add status and JSON to response.
  response.status(status);
  response.json(data);
};

// loanGetAll: get all loans
module.exports.loanGetAll = function(request, response) {
  User
    .find({})
    .exec(function(error, users) {
      if (!users) {  // If user not found
        getJsonResponse(response, 404, {
          "message": 
            "Cannot find user with given identifier idUser."
        });
        return;
      // if error while executing function
      } else if (error) {
        getJsonResponse(response, 500, error);
        return;
      }
      
      // get loans of all users and concatenate in array and return as response.
      var loans = [];
      users.forEach(function(e) {
        loans.push(e);
      })
      
      // return array of loans.
      getJsonResponse(response, 200, loans);
    });
};


// loanCreate: create new loan
module.exports.loanCreate = function(request, response) {
  var idUser = request.params.idUser;
  if (idUser) {
    User
      .findById(idUser)
      .select('loans')
      .exec(
        function(error, user) {
          if (error) {
            getJsonResponse(response, 400, error);
          } else {
            addLoan(request, response, user);
            getJsonResponse(response, 200, { "status": "success" });
          }
        }
      );
  } else {
    getJsonResponse(response, 400, {
      "message": 
        "Cannot find user with specified id."
    });
  }
};





// TODO

// addLoan: add new loan to user with specified id.
var addLoan = function(request, response, user) {
  if (!user) {
    getJsonResponse(response, 404, {
      "message": "Cannot find user."
    });
  } else {
    
    
    
    
    
    // TODO check loan validity with function
    if(true){
      user.loans.push({
        loanID: user.loans[user.loans.length],
        loaner: request.body.username,
        recipient: request.body.recipient,
        // dateIssued: (has default initial value)
        deadline: request.body.deadline,
        amount: request.body.amount,
        currency: request.body.currency,
        interest: request.body.interest,
        payment_interval: request.body.payment_interval,
        payment_amount: request.body.payment_amount,
        compoundInterest: request.body.compoundInterest,
        interest_on_debt: request.body.interest_on_debt
        // status: (has default initial value)
      });
    } else {
      // handle invalid loan
      getJsonResponse(response, 406, {
        "message": "Loan is invalid."
      });
    }
    user.save(function(error, user) {
      var addedLoan;
      if (error) {
        getJsonResponse(response, 400, error);
      } else {
        //posodobiPovprecnoOceno(user._id);
        addedLoan = user.loans[user.loans.length - 1];
        getJsonResponse(response, 201, addedLoan);
      }
    });
  }
};






// loanGetSelected: get all loans of user with given id
module.exports.loanGetSelected = function(request, response) {
    // if request has parameters and the parameters include idUser
    if (request.params && request.params.idUser) {
    User
      .findById(request.params.idUser)
      .exec(function(error, user) {
        if (!user) {  // If user not found
          getJsonResponse(response, 404, {
            "message": 
              "Cannot find user with given identifier idUser."
          });
          return;
        // if error while executing function
        } else if (error) {
          getJsonResponse(response, 500, error);
          return;
        }
        // If success, get all loans of user.
        var loans = user.loans;
        getJsonResponse(response, 200, loans);
      });
  // else if no parameters or if parameters do not include idUser
  } else {
    getJsonResponse(response, 400, { 
      "message": "identifier idUser is missing."
    });
  }
};







// loanUpdateSelected: update loan with specified loanID of user with specified username
module.exports.loanUpdateSelected = function(request, response) {
  // if request does not contain user's id or loan's id
  if (!request.params.idUser || !request.params.idLoan) {
    getJsonResponse(response, 400, {
      "message": 
        "Cannot find user/loan, " + 
        "idUser and idLoan must not be missing."
    });
    return;
  }
  User
    .findById(request.params.idUser)
    .select('loans')
    .exec(
      function(error, user) {
        // If user with specified username does not exist.
        if (!user) {
          getJsonResponse(response, 404, {
            "message": "Cannot find user"
          });
          return;
        // If encountered error
        } else if (error) {
          getJsonResponse(response, 500, error);
          return;
        }
        // If user has property loans and there is at least one loan
        if (user.loans && user.loans.length > 0) {
          // Get loan to be updated.
          var updatedLoan = 
            user.loans.id(request.params.idLoan);
          // if loan with given id not found
          if (!updatedLoan) {
            getJsonResponse(response, 404, {
              "message": "Cannot find loan with given loanID."
            });
          } else {
            
            
            
            
            
            // TODO
            updatedLoan.avtor = request.body.naziv;
            updatedLoan.ocena = request.body.ocena;
            updatedLoan.besediloKomentarja = request.body.komentar;
            
            
            
            
            // Save modified user.
            user.save(function(error, user) {
              // if encountered error
              if (error) {
                getJsonResponse(response, 400, error);
              // If success, return updated loan.
              } else {
                getJsonResponse(response, 200, updatedLoan);
              }
            });
          }
        // if user does not have property loans or user has no loans
        } else {
          getJsonResponse(response, 404, {
            "message": "Cannot find loans to update."
          });
        }
      }
    );
};




// loanDeleteSelected: delete loan od user with specified username with specified loanID
module.exports.loanDeleteSelected = function(request, response) {
  // if idUser or idLoan are missing
  if (!request.params.idUser || !request.params.idLoan) {
    getJsonResponse(response, 400, {
      "message": 
        "cannot find user/loan" + 
        "idUser and idLoan must both be present."
    });
    return;
  }
  User
    .findById(request.params.idUser)
    .exec(
      function(error, user) {
        // If user not found
        if (!user) {
          getJsonResponse(response, 404, {
            "message": "Cannot find user"
          });
          return;
        // If encountered error
        } else if (error) {
          getJsonResponse(response, 500, error);
          return;
        }
        // If user has property loans and there is at least one loan.
        if (user.loans && user.loans.length > 0) {
          // If no loan with specified loanID
          if (!user.loans.id(request.params.idLoan)) {
            getJsonResponse(response, 404, {
              "message": "Cannot find loan."
            });
          } else {
            // Remove loan with specified loanID.
            user.loans.id(request.params.idLoan).remove();
            // Save user.
            user.save(function(error) {
              // if encountered error
              if (error) {
                getJsonResponse(response, 500, error);
              } else {
                // gone
                getJsonResponse(response, 204, null);
              }
            });
          }
        } else {
          // If loan with specified loanID not found, return error message.
          getJsonResponse(response, 404, {
            "message": "No loan to delete"
          });
        }
      }
    );
};