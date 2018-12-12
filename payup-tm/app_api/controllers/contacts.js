var mongoose = require('mongoose');
var User = mongoose.model('User');

// REST API database access methods

// getJsonResponse: take response, status and JSON data and add status and data to response.
var getJsonResponse = function(response, status, data) {
  // Add status and JSON to response.
  response.status(status);
  response.json(data);
};

/*
IMPLEMENTED
router.get('/contacts', ctrlContacts.contactGetAll);
router.post('/user/:idUser/contacts', ctrlContacts.contactCreate);
router.get('/user/:idUser/contacts/:idContact', ctrlContacts.contactGetSelected);
router.put('/user/:idUser/contacts/:idContact', ctrlContacts.contactUpdateSelected);
router.delete('/user/:idUser/contacts/:idContact', ctrlContacts.contactDeleteSelected);
*/

// GET ALL CONTACTS FROM DATABSE //////////////////////////////////////

// contactGetAll: get all contacts
module.exports.contactGetAll = function(request, response) {
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
      
      // Get contacts of all users and concatenate in array and return as response.
      var contacts = [];
      users.forEach(function(e) {
        contacts = contacts.concat(e.contacts);
      });
      
      // return array of contacts.
      getJsonResponse(response, 200, contacts);
    });
};
//////////////////////////////////////////////////////////////////////////


// MANAGING CONTACTS /////////////////////////////////////////////////////

// addContact: add contact to user with specified username 
module.exports.contactCreate = function(request, response) {
  // get user's id
  var idUser = request.params.idUser;
  // if idUser is not null
  if (idUser) {
    // find user by its id (username)
    User
      .findById(idUser)
      .select('contacts')
      .exec(
        function(error, user) {
          if (error) {
            getJsonResponse(response, 400, error);
          } else {
            addContactToUser(request, response, user);
          }
        }
      );
  } else {
    getJsonResponse(response, 400, {
      "message": 
        "Cannot find user with given username."
    });
  }
};

// *** AUXILIARY FUNCTIONS *** //

// addContactToUser: auxiliary function for addContact (see above)
var addContactToUser = function(request, response, user) {
  // If user undefined.
  if (!user) {
    getJsonResponse(response, 404, {
      "message": "Cannot find user."
    });
  } else {
    // Create new contact.
    var newContact = {
      name: request.body.name,
      surname: request.body.surname,
      username: request.body.username,
      email: request.body.email,
      notes: ""
    };
    // Validate created contact.
    validateContact(newContact).then(function(result) {
      // If all went well.
      if (result) {
        // Save user.
        user.contacts.push(newContact);
        user.save(function(error, user) {
          var addedContact;
          // if encountered error
          if (error) {
            getJsonResponse(response, 400, error);
          } else {
            // Get contact that was added and return as response.
            addedContact = user.contacts[user.contacts.length - 1];
            getJsonResponse(response, 201, addedContact);
          }
        });
      } else {
        // If contact is invalid.
        getJsonResponse(response, 400, {
          "message": "Invalid contact parameters."
        });
      }
    });
  }
};

// validateContact: validate contact properties
var validateContact = function(contact) {
  return new Promise(function(resolve, reject) {
    // Regular expression for verifying email adresses
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Check types and values of new contact properties.
    if (
      typeof contact.name === 'string' &&
      typeof contact.surname === 'string' &&
      typeof contact.username === 'string' &&
      re.test(String(contact.email).toLowerCase())
    ) {
      // Check if contact username exists.
      usernameExists(contact.username).then(function(result) {
        if (result) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    } else {  // If types and values of contact properties are not valid
      return resolve(false);
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
        if (!user) {   // If user not found
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

// ** loanGetUsersContacts: get all loans of user with given id
module.exports.contactGetUsersContacts = function(request, response) {
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
        var contacts = user.contacts;
        getJsonResponse(response, 200, contacts);
      });
  // else if no parameters or if parameters do not include idUser
  } else {
    getJsonResponse(response, 400, { 
      "message": "identifier idUser is missing."
    });
  }
};


// contactGetSelected: return contact with given idContact (username) of user with given idUser (username)
module.exports.contactGetSelected = function(request, response) {
  // if request has parameters and they include idUser and idContact
  if (request.params && request.params.idUser && request.params.idContact) {
    User
      .findById(request.params.idUser)
      .select('username contacts')
      .exec(
        function(error, user) {
          var contact;
          // if user not found
          if (!user) {
            getJsonResponse(response, 404, {
              "message": 
                "Cannot find user."
            });
            return;
            // if encountered error
          } else if (error) {
            getJsonResponse(response, 500, error);
            return;
          }
          // if user has property contacts and user has at least one contact
          if (user.contacts && user.contacts.length > 0) {
            // Get contact.
            contact = user.contacts.id(request.params.idContact);
            // if contact not found
            if (!contact) {
              getJsonResponse(response, 404, {
                "message": 
                  "Cannot find contact."
              });
            } else {
              // Return signal object.
              getJsonResponse(response, 200, contact);
            }
          // if no contacts found
          } else {
            getJsonResponse(response, 404, {
              "message": "Cannot find any contact."
            });
          }
        }
      );
  } else {
    getJsonResponse(response, 400, {
      "message": 
        "Invalid request parameters."
    });
  }
};


// contactUpdateSelected: update contact with specifiedcontactID of user with specified userID
module.exports.contactUpdateSelected = function(request, response) {
  // If request parameters do not include idUser and idContact
  if (!request.params.idUser || !request.params.idContact) {
    getJsonResponse(response, 400, {
      "message": 
        "Cannot find user/contact, " + 
        "idUser and idContact must both be present."
    });
    return;
  }
  User
    .findById(request.params.idUser)
    .select('contacts')
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
        // If user has property contacts and user has at least one contact
        if (user.contacts && user.contacts.length > 0) {
          var currentContact = 
            user.contacts.id(request.params.idContact);
          if (!currentContact) {
            getJsonResponse(response, 404, {
              "message": "Cannot find contact."
            });
          } else {
            // Regular expression for verifying email adresses
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            // VALIDATE REQUESTED UPDATES
            if (  // Validate contact properties types and values.
              typeof request.body.name === 'string' &&
              typeof request.body.surname === 'string' &&
              typeof request.body.notes === 'string' &&
              re.test(String(request.body.email).toLowerCase())
              ) {
              // Update contact
              currentContact.name = request.body.name;
              currentContact.surname = request.body.surname;
              currentContact.email = request.body.email;  
              currentContact.notes = request.body.notes;
              console.log(currentContact);
            } else {
              // If contact parameters are invalid.
              getJsonResponse(response, 400, {
                "message": "Invalid contact parameters."
              });
              return;
            }
            // Save user with modified contact parameter.
            user.save(function(error, user) {
              // if encountered error
              if (error) {
                getJsonResponse(response, 400, error);
              } else {
                // Return updated contact as response.
                getJsonResponse(response, 200, currentContact);
              }
            });
          }
        } else {
          getJsonResponse(response, 404, {
            "message": "No contact to update."
          });
        }
      }
    );
};

// contactDeleteSelected
module.exports.contactDeleteSelected = function(request, response) {
  // If request parameters do not include user id or contact id
  if (!request.params.idUser || !request.params.idContact) {
    getJsonResponse(response, 400, {
      "message": 
        "Cannot find user/contact, " + 
        "idUser and idContact must both be present."
    });
    return;
  }
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
          // if encountered error
        } else if (error) {
          getJsonResponse(response, 500, error);
          return;
        }
        // if user has property contacts and user has at least one contact
        if (user.contacts && user.contacts.length > 0) {
          // if contact with given idContact not found
          if (!user.contacts.id(request.params.idContact)) {
            getJsonResponse(response, 404, {
              "message": "Cannot find contact."
            });
          } else {
            // Remove contact with given idContact.
            user.contacts.id(request.params.idContact).remove();
            // Save user state.
            user.save(function(error) {
              // if encountered error
              if (error) {
                getJsonResponse(response, 500, error);
              } else {
                // GONE
                getJsonResponse(response, 204, null);
              }
            });
          }
        // if contact not found
        } else {
          getJsonResponse(response, 404, {
            "message": "No contacts to delete."
          });
        }
      }
    );
};

//////////////////////////////////////////////////////////////////////////