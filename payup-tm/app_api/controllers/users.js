// getJsonResponse: take response, status and JSON data and add status and data to response.
var getJsonResponse = function(response, status, data) {
  // Add status and JSON to response.
  response.status(status);
  response.json(data);
};

// loanCreate: create new loan
module.exports.userCreate = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};

module.exports.userGetSelected = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};

module.exports.userUpdateSelected = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};

module.exports.userDeleteSelected = function(request, response) {
  
  // Return JSON response
  getJsonResponse(response, 200, {"status": "uspešno"});
};