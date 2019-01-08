(function() {
  var loansData = function($http, authentication) {
    // loans: get specified page of user's loans.
    var loans = function(idUser, pageIndex) {
      return $http.get('/api/users/' + idUser + '/loans/' + pageIndex, {
        headers: {
          filtidx: 0,
          Authorization: 'Bearer ' + authentication.getToken()
        }
      }).then(function success(response) {
          return response;
      });
    };
    
    // Make HEAD request to server to get number of user's loans.
    var numLoans = function(idUser) {
      return $http.head('/api/users/' + idUser + '/loans', {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      }).then(function success(response) {
        return response;
      }, function error(response) {
        return response;
      });
    };
    // Return implemented functions.
    return {
      loans: loans,
      numLoans: numLoans
    };
  };
  
  loansData.$inject = ['$http', 'authentication'];
  
  /* global angular */
  angular
    .module('payupApp')
    .service('loansData', loansData);
})();