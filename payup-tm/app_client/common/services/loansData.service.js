(function() {
  var loansData = function($http, authentication) {
    var loans = function(idUser) {
      return $http.get('/api/users/' + idUser + '/loans', {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      });
    };
    return {
      loans: loans
    };
  };
  
  loansData.$inject = ['$http', 'authentication'];
  
  /* global angular */
  angular
    .module('payupApp')
    .service('loansData', loansData);
})();