var passport = require('passport');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var User = mongoose.model('User');
var testingData = require('./testingData');
var requestF = require('request');

// Create mail transporter.
let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'payup.app.2019',
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});


// getJsonResponse: take response, status and JSON data and add status and data to response.
var getJsonResponse = function(response, status, data) {
  // Add status and JSON to response.
  response.status(status);
  response.json(data);
};


// fillDB: intialize database collection Users with testing data.
module.exports.fillDB = function(request, response) {
  var createdPromises = testingData.users.map(function(testUser) {
    return User.create(testUser);
  });
  Promise.all(createdPromises).then(function(result) {
    getJsonResponse(response, 201, {"status" : "done"});
  }).then(null, function(err) {
      getJsonResponse(response, 400, err);
  });
};


// authLogIn: log in a user by verifying the username and password
// Return JWT if log in successfull
module.exports.authLogIn = function(request, response) {
	// If username or password missing
	if (!request.body.username || !request.body.password) {
		getJsonResponse(response, 400, {
			"message": "Missing data"
		});
	}
	// Authenticate user and return JWT if authentication successfull
	passport.authenticate('local', function(error, user, data) {
		if (error) {	// If encountered error
			getJsonResponse(response, 404, error);
			return;
		}
		if (user && user.status == 1) { 	// If authorization successfull, return generated JWT.
			getJsonResponse(response, 200, {
				"token" : user.generateJwt()
			});
		} else {		// If authorization unsuccessfull...
			getJsonResponse(response, 400, data);
		}
	})(request, response);
};

// Validate reCAPTCHA using Google's API
var validateCaptchaResponse = function(response) {
  return new Promise(function(resolve) {
    requestF.post(
      'https://www.google.com/recaptcha/api/siteverify',
      {
          form: {
              secret: process.env.RECAPTCHA_PASS,
              response: response
          }
      },
      function (error, response, body) {
          if (!error && response.statusCode == 200) {
            resolve(Boolean(JSON.parse(response.body).success));
          } else {
            resolve(false);
          }
      }
    );
  });
};

// authSignUp: create new user and store in DB
module.exports.authSignUp = function(request, response) {
  // Verify captcha
  validateCaptchaResponse(request.body.response).then(function(result) {
    if (result) {
      // Check if passwords match.
      if(request.body.user.password.length == 2 && request.body.user.password[0] === request.body.user.password[1]){
    	// Create new user.
        var newUser = new User();
        newUser.name = request.body.user.name;
        newUser.surname = request.body.user.surname;
        newUser._id = request.body.user.username;
        newUser.setPassword(request.body.user.password[0]);
        newUser.email = request.body.user.email;
        newUser.gender = request.body.user.gender;
        newUser.dateJoined = new Date().toJSON().slice(0,10).replace(/-/g,'-');
        newUser.status = 0;
        newUser.defaultCurrency = "EUR";
        newUser.nightmode = false;
        newUser.loans = [];
        newUser.contacts = [];
        newUser.messages = [];
      // if passwords do not match
      } else {
        getJsonResponse(response, 400, {
              "message": "Passwords must match."
        });
        return;
      }
      // Validate created user.
      validateUser(newUser).then(function(result) {
        // If successfuly validated, create new user and send confirmation e-mail.
        if (result) {
          // Create new user.
          User.create(newUser, function(error, user) {
            // If there was an error
            if (error) {
              getJsonResponse(response, 500, error);
            // If all went well, send confirmation e-mail.
            } else {
              sendConfirmationMail(newUser.email, newUser._id, newUser.validationCode).then(function(result) {
                // If confirmation mail successfuly sent, return new user as signal value.
                if(result) {
                  getJsonResponse(response, 201, user);
                } else {
                  // if trouble sending confirmation e-mail
                  getJsonResponse(response, 500, {'status' : 'Error sending confirmation mail.'});
                }
              });
            }
          });
        // If new user is not valid.
        } else {
          getJsonResponse(response, 400, {
              "message": "invalid user parameters"
          }); 
        }
      });
    } else {
      getJsonResponse(response, 400, {
        "message": "error verifying captcha response"
      }); 
    }
  });
};


// validateUser: validate user properties
var validateUser = function(newUser) {
  // Validate user.
  return new Promise(function(resolve, reject) {
        // Create regular expression for email verification.
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	// Check parameter types and values.
      if (
        typeof newUser.name === 'string' &&
        typeof newUser.surname === 'string' &&
        typeof newUser._id === 'string' &&
        re.test(String(newUser.email).toLowerCase()) &&
        typeof newUser.gender === 'string' && (newUser.gender == 'm' || newUser.gender == 'f')
       ) {
        // Check if username already exists.
        usernameExists(newUser._id).then(function(result) {
          // If username is free, resolve with true.
          if (!result) {
            resolve(true);
          // else resolve with false.
          } else {
            resolve(false);
          }
        });
    // If types and values not valid, resolve with false.
    } else {
      resolve(false);
    }
    
  });
};


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

// sendConfirmationMail: send confirmation mail to specified email
var sendConfirmationMail = function(emailAddress, idUser, validationCode) {
  return new Promise(function(resolve, reject) {
    sendMail(emailAddress, idUser, validationCode).then(function(result) {
      if (result) {  // If mail successfuly sent
        resolve(true);
      } else {  // Else.
        resolve(false);
      }
    });
  });
};

// sendMail: auxiliary function that sends mail.
var sendMail = function(emailAddress, idUser, validationCode) {
  return new Promise(function(resolve, reject) {
    // Define helper options.
    let HelperOptions = {
      from: 'payup.app.2019@gmail.com',
      to: emailAddress,
      subject: 'Confirm e-mail',
      text: 'Please click the link below to confirm your e-mail account.\n https://sp-projekt2-excogitator.c9users.io/api/users/' + idUser + '/' + validationCode
    };
    // Send mail via transporter.
    transporter.sendMail(HelperOptions, (error, info) => {
        if (error) {      // If encoutered error, resolve as false.
          resolve(false);
        }
        resolve(true);  // If successfuly sent mail, resolve as true.
    });
  });
};

// authConfirm: confirm user's acount - this is called with a get request generated by following the link in the sent email
module.exports.authConfirm = function(request, response) {
  // If all request parameters are present
  if (request.params && request.params.idUser && request.params.validationCode) {
    // Find user by id and activate account.
    User.findById(request.params.idUser).exec(function(error, user) {
      if (user._id == request.params.idUser && request.params.validationCode == user.validationCode) {
        user.status = 1;
        user.save(function(error, user) {
          if (error) {
            getJsonResponse(response, 400, error);
          } else {
            response.writeHeader(200, {"Content-Type": "text/html"});  
            response.write('<div style="font-family: Times-New-Roman;"><h1>Account successfully verified!</h1><p>You can now log in with your account and start using our service!</p>Click <a href="https://sp-projekt2-excogitator.c9users.io/">here</a> to go back to the PayUp website and log in!</div>');  
            response.end();
          }
        });
      } else {
        getJsonResponse(response, 400, "Missing request parameters");
      }
    });
  }
};

///////////////////////////////////////////////////////////////////////////////////

// Get user's id (username) from JWT
var getLoggedId = function(request, response, callback) {
  // If request contains a payload and the payload contains a username
  if (request.payload && request.payload.username) {
    User
      .findById(
        request.payload.username
      )
      .exec(function(error, user) {
        if (!user) {     // If user not found
          getJsonResponse(response, 404, {
            "message": "User not found"
          });
          return;
        } else if (error) {   // if encountered error
          getJsonResponse(response, 500, error);
          return;
        }
        callback(request, response, user._id);
      });
  } else {    // Else if no payload or if payload does not contain field username
    getJsonResponse(response, 400, {
      "message": "Inadequate data in token"
    });
    return;
  }
};