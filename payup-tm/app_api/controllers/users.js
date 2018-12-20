var mongoose = require('mongoose');
var User = mongoose.model('User');
var testingData = require('./testingData');
var nodemailer = require('nodemailer');

// Create mail transporter.
let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'payup.app.2019',
    pass: 'tralalahopsasa123321',
  },
  tls: {
    rejectUnauthorized: false
  }
});

// REST API database access methods

/*
IMPLEMENTED

router.get('/users', ctrlUsers.userGetAll);
router.post('/users', ctrlUsers.userCreate);
router.get('/users/:idUser', ctrlUsers.userGetSelected);
router.delete('/users/:idUser', ctrlUsers.userDeleteSelected);
*/


// getJsonResponse: take response, status and JSON data and add status and data to response.
var getJsonResponse = function(response, status, data) {
  // Add status and JSON to response.
  response.status(status);
  response.json(data);
};


// DB //////////////////////////////////////////////////////////////////

// nukeDB: remove all contents of database collection Users
module.exports.nukeDB = function(request, response) {
  User.remove({}, function(err, user){
    if(err) {
      // if encountered error
      getJsonResponse(response, 400, err);   
    }
    else {
      getJsonResponse(response, 204, null);
    }
  }); 
};

// nukeDBindexes: remove all stored indexes from database
module.exports.nukeDBindexes = function(request, response) {
  User.collection.dropIndexes(function (err, results) {
    if (err) {
      // if encountered error
      getJsonResponse(response, 400, err);
    } else {
      getJsonResponse(response, 204, null);
    }
  });
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

///////////////////////////////////////////////////////////////////////


// MAIL ///////////////////////////////////////////////////////////////

// sendConfirmationMail: send confirmation mail to specified email
var sendConfirmationMail = function(emailAddress) {
  return new Promise(function(resolve, reject) {
    sendMail(emailAddress).then(function(result) {
      if (result) {  // If mail successfuly sent
        resolve(true);
      } else {  // Else.
        resolve(false);
      }
    });
  });
};

// sendMail: auxiliary function that sends mail.
var sendMail = function(emailAddress) {
  return new Promise(function(resolve, reject) {
    // Define helper options.
    let HelperOptions = {
      from: 'payup.app.2019@gmail.com',
      to: emailAddress,
      subject: 'Confirm e-mail',
      text: 'Please click the link below to confirm your e-mail account.\n https://sp-projekt2-excogitator.c9users.io'
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

//////////////////////////////////////////////////////////////////////


// MANAGING USERS ////////////////////////////////////////////////////

// userGetAll: get all users in database
module.exports.userGetAll = function(request, response) {
  // Return all users
  User
    .find({})
    .exec(function(error, users) {
      if (!users) {  // If user not found
        getJsonResponse(response, 404, {
          "message": 
            "Cannot find users."
        });
        return;
      // if error while executing function
      } else if (error) {
        getJsonResponse(response, 500, error);
        return;
      }
      // if success
      getJsonResponse(response, 200, users);
    });
};


// userCreate: create new user
module.exports.userCreate = function(request, response) {
  // Check if passwords match.
  console.log(request.body);
  if(request.body.password.length == 2 && request.body.password[0] === request.body.password[1]){
    console.log("HERE");
    // Create new user.
    var newUser = {
      name: request.body.name,
      surname: request.body.surname,
      _id: request.body.username,
      password: request.body.password[0],
      email: request.body.email,
      gender: request.body.gender,
      dateJoined: new Date().toJSON().slice(0,10).replace(/-/g,'-'),
      status: 0,
      defaultCurrency: "EUR",
      nightmode: false,
      loans: [],
      contacts: []
    };
    console.log(newUser);
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
          sendConfirmationMail(newUser.email).then(function(result) {
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
};

// *** AUXILIARY FUNCTIONS *** //

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
        typeof newUser.password === 'string' &&
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

// *************************** //


// userGetSelected: return user with given idUser (username)
module.exports.userGetSelected = function(request, response) {
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
        // if success
        getJsonResponse(response, 200, user);
      });
  // else if no parameters or if parameters do not include idUser
  } else {
    getJsonResponse(response, 400, { 
      "message": "identifier idUser is missing."
    });
  }
};

// userDeleteSelected: delete user with specified idUser (username)
module.exports.userDeleteSelected = function(request, response) {
  // Get idUser.
  var idUser = request.params.idUser;
  // if idUser is not null.
  if (idUser) {
    User
      .findByIdAndRemove(idUser)  // Find user by idUser and remove.
      .exec(
        function(error, user) {
          // if encountered error
          if (error) {
            getJsonResponse(response, 404, error);
            return;
          }
          // if success, return status 204 and null signal object.
          getJsonResponse(response, 204, null);
        }
      );
      // if idUser not present.
  } else {
    getJsonResponse(response, 400, {
      "message": 
        "Cannot find user. idUser must be present."
    });
  }
};

//////////////////////////////////////////////////////////////////////











// -> TODO <-

// MESSAGES /////////////////////////////////////////////////////////


// getMessagesAll: get all messages of all users.
module.exports.getMessagesAll = function(request, response) {
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
      
      // get contacts of all users and concatenate in array and return as response.
      var messages = [];
      users.forEach(function(e) {
        messages = messages.concat(e.messages);
      });
      
      // return array of contacts.
      getJsonResponse(response, 200, messages);
    });
};


// userGetMessages: get messages of users with speified id.
module.exports.userGetMessages = function(request, response) {
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
        // If success, get all user's messages.
        var messages = user.messages;
        getJsonResponse(response, 200, messages);
      });
  // else if no parameters or if parameters do not include idUser
  } else {
    getJsonResponse(response, 400, { 
      "message": "identifier idUser is missing."
    });
  }
};


// userDeleteMessage: delete message with specified id of user with specified id.
module.exports.userDeleteMessage = function(request, response) {
  
};


// userDeleteAllMessages: delete all messages of user with specified id.
module.exports.userDeleteAllMessages = function(request, response) {
  
};


// userSetMessageStatus: set message status as read/unread
module.exports.userSetMessageStatus = function(request, response) {
  
};


/////////////////////////////////////////////////////////////////////








// AVATAR ///////////////////////////////////////////////////////////


// userGetAvatar: get avatar of user with specified user id
module.exports.userGetAvatar = function(request, response) {
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
        // If success, get user's avatar.
        var avatar = user.avatar;
        getJsonResponse(response, 200, avatar);
      });
  // else if no parameters or if parameters do not include idUser
  } else {
    getJsonResponse(response, 400, { 
      "message": "identifier idUser is missing."
    });
  }
};


// userSetAvarar: set avatar of user with specified user id.
module.exports.userSetAvatar = function(request, response) {
  
};


/////////////////////////////////////////////////////////////////////

// SETTINGS /////////////////////////////////////////////////////////


// setSettings: set settings for user with specified user id (night mode and default currency).
module.exports.setSettings = function(request, response) {
  
};

//////////////////////////////////////////////////////////////////////