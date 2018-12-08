var mongoose = require('mongoose');
var User = mongoose.model('User');

// REST API database access methods

// getJsonResponse: take response, status and JSON data and add status and data to response.
var getJsonResponse = function(response, status, data) {
  // Add status and JSON to response.
  response.status(status);
  response.json(data);
};










// TODO: 7.12.2018
// userGetAll: get all users 
module.exports.userGetAll = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};








// userCreate: create new user
module.exports.userCreate = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};









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







module.exports.userUpdateSelected = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};







module.exports.userDeleteSelected = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};








