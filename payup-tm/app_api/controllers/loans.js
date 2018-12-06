/* var mongoose = require('mongoose');
var Loan = mongoose.model('Loan'); */

// getJsonResponse: take response, status and JSON data and add status and data to response.
var getJsonResponse = function(response, status, data) {
  // Add status and JSON to response.
  response.status(status);
  response.json(data);
};

// userGetAll: get all users 
module.exports.loanGetAll = function(request, response) {
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};

// loanCreate: create new loan
module.exports.loanCreate = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};

module.exports.loanGetSelected = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};

module.exports.loanUpdateSelected = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};

module.exports.loanDeleteSelected = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};