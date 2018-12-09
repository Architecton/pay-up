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

*** router.get('/users', ctrlUsers.userGetAll);                                         // TESTED
*** router.post('/users', ctrlUsers.userCreate);                                        // TESTED
*** router.get('/users/:idUser', ctrlUsers.userGetSelected);                            // TESTED
(TODO implement if time) router.put('/users/:idUser', ctrlUsers.userUpdateSelected);    // TESTED
*** router.delete('/users/:idUser', ctrlUsers.userDeleteSelected);                      // TESTED
*/

// getJsonResponse: take response, status and JSON data and add status and data to response.
var getJsonResponse = function(response, status, data) {
  // Add status and JSON to response.
  response.status(status);
  response.json(data);
};

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

// nukeDB: remove all contents of database collection Users
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


// MAIL ///////////////////////////////////////////////////////////////

// sendConfirmationMail: send confirmation mail to specified email
module.exports.sendConfirmationMail = function(request, response) {
  var emailAddress = request.params.email;
  sendMail(emailAddress).then(function(result) {
    if (result) {
      getJsonResponse(response, 400);
    } else {
      getJsonResponse(response, 204, null);
    }
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
        if (error) {
          resolve(false);
        }
        console.log("The message was sent!");
        console.log(info);
        resolve(true);
    });
  });
};

//////////////////////////////////////////////////////////////////////




/*
var Promise = require('bluebird'); // could also be Q or another A+ library

app.post('/api/data', function(req, res, next) {
  var issues = req.body.issues;

  // map the issues to an array of promises for created dashData docs
  var createdPromises = issues.map(function(issue){
    return dashData.create({key: issue.key, status: issue.fields.status.name, assignee: issue.fields.assignee, summary: issue.fields.summary}); // returns a promise
  });

  Promise.all(createdPromises).then(function(results){
    res.json(results); // only sends when all docs have been created
  }).then(null, next); // error handler - pass to `next`

});
*/


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
  var newUser = {
    name: request.body.name,
    surname: request.body.surname,
    _id: request.body.username,
    password: request.body.password,
    email: request.body.email,
    gender: request.body.gender,
    dateJoined: new Date().toJSON().slice(0,10).replace(/-/g,'-'),
    status: 0,
    defaultCurrency: "EUR",
    nightmode: false,
    loans: [],
    contacts: []
  };
  
  validateUser(newUser).then(function(result) {
    if (result) {
      User.create(newUser, function(error, user) {
        if (error) {
          getJsonResponse(response, 400, error);
        } else {
          getJsonResponse(response, 201, user);
        }
      });
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
  return new Promise(function(resolve, reject) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (
        typeof newUser.name === 'string' &&
        typeof newUser.surname === 'string' &&
        typeof newUser._id === 'string' &&
        typeof newUser.password === 'string' &&
        re.test(String(newUser.email).toLowerCase()) &&
        typeof newUser.gender === 'string' && (newUser.gender == 'm' || newUser.gender == 'f')
       ) {
      
        usernameExists(newUser._id).then(function(result) {
          if (!result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
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
          console.log("DOES NOT EXIST");
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


// TODO implement if time (not necessary for functionality of application)
/*
// userUpdateSelected: update user with specified idUser (username)
module.exports.userUpdateSelected = function(request, response) {
  if (!request.params.idUser) {
    getJsonResponse(response, 400, {
      "message": 
        "Cannot find user. idUser must be present."
    });
    return;
  }
  User
    .findById(request.params.idUser)
    .select('-loans -contacts')
    .exec(
      function(error, user) {
        if (!user) {
          getJsonResponse(response, 404, {
            "message": "Cannot find user."
          });
          return;
        } else if (error) {
          getJsonResponse(response, 500, error);
          return;
        }
        // TODO validate and update
        user.naziv = request.body.naziv;
        user.naslov = request.body.naslov;
        user.lastnosti = request.body.lastnosti.split(",");
        user.koordinate = [
          parseFloat(request.body.lng), 
          parseFloat(request.body.lat)
        ],
        user.delovniCas = [{
          dnevi: request.body.dnevi1,
          odprtje: request.body.odprtje1,
          zaprtje: request.body.zaprtje1,
          zaprto: request.body.zaprto1
        }, {
          dnevi: request.body.dnevi2,
          odprtje: request.body.odprtje2,
          zaprtje: request.body.zaprtje2,
          zaprto: request.body.zaprto2
        }];
        user.save(function(error, user) {
          if (error) {
            getJsonResponse(response, 400, error);
          } else {
            getJsonResponse(response, 200, user);
          }
        });
      }
    );
};
*/

// userDeleteSelected: delete user with specified idUser (username)
module.exports.userDeleteSelected = function(request, response) {
  // Get idUser.
  var idUser = request.params.idUser;
  // if idUser is not null.
  if (idUser) {
    User
      .findByIdAndRemove(idUser)
      .exec(
        function(error, user) {
          // if encountered error
          if (error) {
            getJsonResponse(response, 404, error);
            return;
          }
          // if success, return status 204 and null object.
          getJsonResponse(response, 204, null);
        }
      );
      // if idUser not present
  } else {
    getJsonResponse(response, 400, {
      "message": 
        "Cannot find user. idUser must be present."
    });
  }
};





