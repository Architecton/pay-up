(function() {
  var loansData = function($http) {
    var loans = function(idUser) {
      return $http.get('/api/users/' + idUser + '/loans');
    };
    return {
      loans: loans
    };
  };
  
  loansData.$inject = ['$http'];
  
  /* global angular */
  angular
    .module('payupApp')
    .service('loansData', loansData);
})();