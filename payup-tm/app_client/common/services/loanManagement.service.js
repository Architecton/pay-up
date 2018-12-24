// authentication service

// authentication:
(function() {
  function loanManagement($http, authentication) {
    
    var addLoan = function(idUser, loanData) {
        return $http.post('/api/users/' + idUser + '/loans', {
            loanData,
            headers: {
                Authorization: 'Bearer ' + authentication.getToken()
            }
        }).then(function success(response) {
           console.log(response.data); 
        });
    };
    
    
    // Return object containing the functions offered by this service.
    return {
      addLoan: addLoan
    };
  }
  
  // Register service
  /* global angular */
  angular
    .module('payupApp')
    .service('loanManagement', loanManagement);
})();