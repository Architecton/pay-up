var mongoose = require('mongoose');
var User = mongoose.model('User');


// getJsonResponse: take response, status and JSON data and add status and data to response.
var getJsonResponse = function(response, status, data) {
  // Add status and JSON to response.
  response.status(status);
  response.json(data);
};

/*
IMPLEMENTED

*** router.get('/loans', ctrlLoans.loanGetAll);                                 // TESTED
*** router.post('/user/:idUser/loans', ctrlLoans.loanCreate);                   // TESTED
*** router.get('/user/:idUser/loans/:idLoan', ctrlLoans.loanGetSelected);       // TESTED
*** router.put('/user/:idUser/loans/:idLoan', ctrlLoans.loanUpdateSelected);    // TESTED
*** router.delete('/user/:idUser/loans/:idLoan', ctrlLoans.loanDeleteSelected); // TESTED
*/

// ** loanGetAll: get all loans
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
        loans = loans.concat(e.loans);
      });
      
      // return array of loans.
      getJsonResponse(response, 200, loans);
    });
};

// loanCreate: create new loan for user with specified idUser (username)
module.exports.loanCreate = function(request, response) {
  // get idUser from request parameters.
  var idUser = request.params.idUser;
  // if idUser not null
  if (idUser) {
    User
      .findById(idUser)
      .select('loans')
      .exec(
        function(error, user) {
          // if encountered error
          if (error) {
            getJsonResponse(response, 400, error);
          } else {
            // add loan to user (see auxiliary function below)
            addLoan(request, response, user);
          }
        }
      );
      // if user not found
  } else {
    getJsonResponse(response, 400, {
      "message": 
        "Cannot find user."
    });
  }
};

// *** AUXILIARY FUNCTIONS *** //

// ** addLoan: add new loan to user with specified id.
var addLoan = function(request, response, user) {
  if (!user) {
    getJsonResponse(response, 404, {
      "message": "Cannot find user."
    });
  } else {
    var newLoan = {
        loaner: request.body.loaner,
        recipient: request.body.recipient,
        dateIssued: new Date().toJSON().slice(0,10).replace(/-/g,'-'),
        deadline: request.body.deadline,
        amount: request.body.amount,
        currency: request.body.currency,
        interest: request.body.interest,
        payment_interval: request.body.payment_interval,
        payment_amount: request.body.payment_amount,
        compoundInterest: request.body.compoundInterest,
        interest_on_debt: request.body.interest_on_debt,
        status: '0'
    };
    
    validateLoan(newLoan).then(function(result) {
      if (result) {
        user.loans.push(newLoan);
        user.save(function(error, user) {
          var addedLoan;
          if (error) {
            getJsonResponse(response, 400, error);
          } else {
            // Get loan that was just added and return it as reponse.
            addedLoan = user.loans[user.loans.length - 1];
            getJsonResponse(response, 201, addedLoan);
          }
        });
      } else {
        getJsonResponse(response, 400, {
          "message": "Invalid loan parameters"
        });
      }
    });
  }
};

// *************************** //


// ** loanGetSelected: get all loans of user with given id
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


// ** loanUpdateSelected: update loan with specified loanID of user with specified username
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
            // check if status code is valid
            if(request.body.status === '0' || request.body.status === '1' || request.body.status === '2') {
              updatedLoan.status = request.body.status;  
            } else {
              getJsonResponse(response, 400, {
                "message": "Invalid loan status code."
              });
              return;
            }
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


// ** loanDeleteSelected: delete loan od user with specified username with specified loanID.
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

/*
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
*/

// debt_by_time: compute debt as a function of time

// start_date: date at which interest starts accumulating (Date instance)
// end_date: date at which loan is repaid (Date instance)
// payment_interval: interval at which an amount is paid
// payment_amount: repayment amount
// principal_amount: loan size
// interest_rate: rate of interest
// type_intereset: type of interest - possible values: 'simple', 'compound' (true, false)
// interest_on_principal: compute interest on current debt or on principal amount (true or false)

// note: this function can also be used to compute the validity of the loan contract (if the debt will be repaid in the given)
function debtByTime(start_date, end_date, payment_interval, payment_amount, principal_amount, interest_rate, type_interest, interest_on_debt) {
  
  // compute_days: compute days between passed dates.
  function compute_days(start_date, end_date) {
      // Take the difference between the dates and divide by milliseconds per day.
      // Round to nearest whole number to deal with daylight saving time.
      return Math.round((end_date - start_date)/(1000*60*60*24));
  }
  
  // Compute number of days  between starting and ending date.
  var num_days = compute_days(start_date, end_date);
  
  // Compute daily interest percentage
  var daily_interest = interest_rate / (12*32);
  
  // Allocate arrays for storing the dependent and independent variable values.
  // Array representing the index of the current day (x-axis).
  var day = new Array(num_days);
  
  // Array representing the total debt on a given day (y-axis).
  var debt_per_day = new Array(num_days);
  
  // if computing interest on current debt
  if (interest_on_debt) {
      
      // if simple interest
      if (!type_interest) {
          // Compute total debt for each day.
          var debt = principal_amount;
          var interval_count = 0;
          var interest;
          for(var i = 1; i <= num_days; i++) {
              interest = principal_amount*daily_interest;
              debt = debt + interest;
              interval_count++;
              // If payment day...
              if (interval_count == payment_interval) {
                  principal_amount -= Math.min(payment_amount, principal_amount);
                  debt -= Math.min(payment_amount, debt);
                  interval_count = 0;
              }
              
              // Add results to arrays storing the independent and dependent variable values.
              day[i-1] = i;
              debt_per_day[i-1] = debt;
          }


      // if compound interest
      } else if (type_interest) {
          
          // Compute total debt for each day.
          var debt = principal_amount;
          var interval_count = 0;
          var interest;
          for(var i = 1; i <= num_days; i++) {
              interest = debt*daily_interest;
              debt += interest;
              interval_count++;
              // if payment day
              if (interval_count == payment_interval) {
                  debt -= Math.min(payment_amount, debt);
                  interval_count = 0;
              }
          }
          
          // Add results to arrays storing the independent and dependent variable values.
          day[i-1] = i;
          debt_per_day[i-1] = debt;
          
          
      }  else {
          throw "Invalid interest type";
      }
      
  // If computing interest on principal amount
  } else {
      // if compound interest
      if (!type_interest) {
       
       
          // Compute total debt for each day.
          var debt = principal_amount;
          var interval_count = 0;
          var interest;
          for(var i = 1; i <= num_days; i++) {
              interest = principal_amount*daily_interest;
              debt += interest;
              interval_count++;
              // If payment day...
              if (interval_count == payment_interval) {
                  debt -= Math.min(payment_amount, debt);
                  interval_count = 0;
              }
              
              // Add results to arrays storing the independent and dependent variable values.
              day[i-1] = i;
              debt_per_day[i-1] = debt;
          }
       
      // if simple interest
      } else if (type_interest) {
       
        // Compute total debt for each day.
          var debt = principal_amount;
          var interval_count = 0;
          var interest;
          for(var i = 1; i <= num_days; i++) {
              interest = principal_amount*daily_interest;
              principal_amount += interest;
              debt += interest;
              interval_count++;
              // if payment day
              if (interval_count == payment_interval) {
                  debt -= Math.min(payment_amount, debt);
                  interval_count = 0;
              }
          }
          
          // Add results to arrays storing the independent and dependent variable values.
          day[i-1] = i;
          debt_per_day[i-1] = debt;
          
      }  else {
          throw "Invalid interest type";
      }
  }
  
  // Return results as a record.
  return {x : day, y : debt_per_day};
}


// validateLoan: check if loan is valid - will be able to be repaid in specified time interval.
function validateLoan(loan) {
  return new Promise(function(resolve, reject) {
    if (loan.dateIssued < loan.deadline && loan.payment_interval > 0 && loan.payment_amount > 0 & loan.amount > 0 && loan.interest >= 0 && typeof loan.compoundInterest === "boolean" && typeof loan.interest_on_debt === "boolean") {
      usernameExists(loan.recipient).then(function(result) {
        if (result) {
          // Get debt values per day.
          var loan_stats = debtByTime(new Date(loan.dateIssued), new Date(loan.deadline), Number(loan.payment_interval), Number(loan.payment_amount), Number(loan.amount), Number(loan.interest), Boolean(loan.compoundInterest), Boolean(loan.interest_on_debt));
          // Get array of debt.
          var debt_by_day = loan_stats.y;
          // If no debt left on last day, contract is valid.
          if(debt_by_day[debt_by_day.length - 1] == 0) {
              resolve(true);
          } else {
              resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    } else {
      resolve(false);
    }
  });
}


// usernameExists: check if user with given username exists in database
var usernameExists = function(username) {
  return new Promise(function(resolve, reject) {
    // if request has parameters and the parameters include idUser
    if (username) {
    User
      .findById(username)
      .exec(function(error, user) {
        if (!user) {  // If user not found
          resolve(false);
        // if error while executing function
        } else if (error) {
          resolve(true);
        }
        // if success
        resolve(true);
      });
    // else if no parameters or if parameters do not include idUser
    } else {
      resolve(true);
    }
  });
};