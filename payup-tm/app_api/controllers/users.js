var mongoose = require('mongoose');
var User = mongoose.model('User');
var testingData = require('./testingData');
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
  getLoggedId(request, response, function(request, response, username) {
    if (username == process.env.ADMIN_USERNAME) {
      User.remove({}, function(err, user){
        if (err) {
          // if encountered error
          getJsonResponse(response, 500, err);   
        }
        else {
          getJsonResponse(response, 204, null);
        }
      }); 
    } else {
      getJsonResponse(response, 401, {"message" : "not authorized"});
    }
  });
};

// TODO Only admin

// nukeDBindexes: remove all stored indexes from database
module.exports.nukeDBindexes = function(request, response) {
  User.collection.dropIndexes(function (err, results) {
    if (err) {
      // if encountered error
      getJsonResponse(response, 500, err);
    } else {
      getJsonResponse(response, 204, null);
    }
  });
};

///////////////////////////////////////////////////////////////////////


// MANAGING USERS ////////////////////////////////////////////////////

// TODO: only admin

// userGetAll: get all users in database
module.exports.userGetAll = function(request, response) {
  // Return all users
  User
    .find({}, 'name surname username')
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

// userGetSelected: return user with given idUser (username)
module.exports.userGetSelected = function(request, response) {
    getLoggedId(request, response, function(request, response, username) {
      // if request has parameters and the parameters include idUser
      if (request.params && request.params.idUser && request.params.idUser == username) {
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
        "message": "Bad request parameters"
      });
    }
  });
};

// userDeleteSelected: delete user with specified idUser (username)
module.exports.userDeleteSelected = function(request, response) {
  getLoggedId(request, response, function(request, response, username) {
    var idUser = request.params.idUser;
    // if idUser is not null and idUser is the same as the username in the JWT
    if (idUser && idUser == username) {
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
          "Bad request parameters"
      });
    }
  });
};

//////////////////////////////////////////////////////////////////////








// -> TODO <-

// MESSAGES /////////////////////////////////////////////////////////

// TODO: only admin

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
  getLoggedId(request, response, function(request, response, username) {
    // if request has parameters, the parameters include idUser and the idUser matches the username
    // in the JWT
    if (request.params && request.params.idUser && request.params.idUser == username) {
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
        "message": "Bad request parameters"
      });
    }
  });
};

// TODO

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
  getLoggedId(request, response, function(request, response, username) {
    // if request has parameters and the parameters include idUser and idUser is same as username in token
    if (request.params && request.params.idUser && request.params.idUser == username) {
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
  }); 
};


// userSetAvarar: set avatar of user with specified user id.
module.exports.userSetAvatar = function(request, response) {
  
};


/////////////////////////////////////////////////////////////////////

// SETTINGS /////////////////////////////////////////////////////////

// setSettings: set settings for user with specified user id (night mode and default currency).
module.exports.userSaveSettings = function(request, response) {
    // If request parameters do not include idUser and idContact
  if (!request.params.idUser) {
    getJsonResponse(response, 400, {
      "message": 
        "Cannot find user, " + 
        "idUser must be present."
    });
    return;
  }
  getLoggedId(request, response, function(request, response, username) {
    if(request.params.idUser == username) {
      User
        .findById(request.params.idUser)
        .exec(
          function(error, user) {
            // if user not found
            if (!user) {
              getJsonResponse(response, 404, {
                "message": "Cannot find user."
              });
              return;
            // If encountered error
            } else if (error) {
                getJsonResponse(response, 500, error);
              return;
            }
            // VALIDATE REQUESTED UPDATES
            if (  // Validate setting values types and values.
              typeof request.body.defaultCurrency === 'string' &&
              typeof request.body.nightmode == 'boolean'
              ) {
              // Update contact
              user.defaultCurrency = request.body.defaultCurrency;
              user.nightmode = Boolean(request.body.nightmode);
            } else {
              // If contact parameters are invalid.
              getJsonResponse(response, 400, {
                "message": "Invalid settings values."
              });
              return;
            }
            // Save user with modified settings.
            user.save(function(error, user) {
              // if encountered error
              if (error) {
                getJsonResponse(response, 500, error);
              } else {
                // Return updated user as response.
                getJsonResponse(response, 200, user);
              }
            });
          }
        );
    } else {
      getJsonResponse(response, 400, { 
          "message": "identifier idUser is missing."
      });
    }
  });
};

//////////////////////////////////////////////////////////////////////


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