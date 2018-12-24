// Service that makes API calls for DB nuking and filling


(function() {
  function testHelper($http, authentication) {
    
    // nuke: delete all users from database
    var nuke = function() {
      // Make a delete request.
      return $http.delete('/api/nukeDB', {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      }).then(
        function success(response) {
          console.log(response.data);
        });
    };
    
    // fill: fill database with testing data
    var fill = function(idUser, contactData) {
      // Make a post request with empty body.
        return $http.post('/api/fillDB', {
            headers: {
                Authorization: 'Bearer ' + authentication.getToken()
            }
        }).then(function success(response) {
           console.log(response.data); 
        });
    };
    
    // Return object containing the functions offered by this service.
    return {
      nuke: nuke,
      fill: fill
    };
  }
  
  // Register service
  /* global angular */
  angular
    .module('payupApp')
    .service('testHelper', testHelper);
})();