(function() {
  var loansData = function($http, authentication) {
    var loans = function(idUser, pageIndex) {
      return $http.get('/api/users/' + idUser + '/loans/' + pageIndex, {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      }).then(function success(response) {
          return response;
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