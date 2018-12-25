// authentication service

// authentication:
(function() {
  function loanManagement($http, authentication) {
    
    
    // addLoan: add new loan to user with specified user ID
    var addLoan = function(idUser, loanData) {
        return $http.post('/api/users/' + idUser + '/loans', loanData, {
            headers: {
                Authorization: 'Bearer ' + authentication.getToken()
            }
        }).then(function success(response) {
           console.log(response); 
        });
    };
    
    
    // confirmLoan: confirm loan with specified loan ID of user with specified user ID
    var confirmLoan = function(idUser, idLoan) {
      return $http.put('/api/users/' + idUser + '/loans/' + idLoan, {status: "active"}, {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      }).then(function success(response) {
        console.log(response.data);
      });
    };
    
    
    // deleteLoan: delete loan with specified loan ID of user with specified user ID
    var deleteLoan = function(idUser, idLoan) {
     return $http.delete('/api/users/' + idUser + '/loans/' + idLoan, {
       headers: {
          Authorization: 'Bearer ' + authentication.getToken()
       }
     }).then(function success(response){
       console.log(response.data);
     });
    };
    
    
    // resolveLoan: resolve loan with specified loan ID of user with specified user ID.
    var resolveLoan = function(idUser, idLoan) {
      return $http.put('/api/users/' + idUser + '/loans/' + idLoan, {status: "resolved"}, {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      }).then(function success(response) {
        console.log(response.data);
      });
    };
    
    
    // Return object containing the functions offered by this service.
    return {
      addLoan: addLoan,
      confirmLoan: confirmLoan,
      deleteLoan: deleteLoan,
      resolveLoan: resolveLoan
    };
  }
  
  // Register service
  /* global angular */
  angular
    .module('payupApp')
    .service('loanManagement', loanManagement);
})();