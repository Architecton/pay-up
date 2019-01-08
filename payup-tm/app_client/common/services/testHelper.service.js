// Service that makes API calls for DB nuking and filling


(function() {
  function testHelper($http, authentication) {
    
    // nuke: delete all users from database
    var nuke = function() {
      // Make a delete request.
      if (authentication.isLoggedIn()) {
        return $http.delete('/api/nukeDB', {
          headers: {
            Authorization: 'Bearer ' + authentication.getToken()
          }
        }).then(
          function success(response) {
            console.log(response.data);
          });
      } else {
        return new Promise(function(resolve, reject) {
          reject("Not Logged in!");
        });
      }
    };
    
    // fill: fill database with testing data
    var fill = function() {
      if (authentication.isLoggedIn()) {
        // Make a post request with empty body.
        return $http.get('/api/fillDB', {
          headers: {
            Authorization: 'Bearer ' + authentication.getToken()
          }
        }).then(function success(response) {
           console.log(response.data); 
        });
      } else {
        return new Promise(function(resolve, reject) {
          reject("Not logged in!");
        });
      }
    };
    
    // Return object containing the functions offered by this service.
    return {
      nuke: nuke,
      fill: fill
    };
  }
  
  testHelper.$inject = ['$http', 'authentication'];
  
  // Register service
  /* global angular */
  angular
    .module('payupApp')
    .service('testHelper', testHelper);
})();