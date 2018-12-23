(function() {
  var loansData = function($http) {
    var loans = function(idUser) {
      var sol = $http.get('/api/users/' + idUser + '/loans', {
        headers: {
          Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImplcnJ5MTIzNDUiLCJuYW1lIjoiSmVybmVqIiwiZW1haWwiOiJqZS52aXZvZEBnbWFpbC5jb20iLCJleHBpcmF0aW9uRGF0ZSI6MTU0NjE3NDU3MywiaWF0IjoxNTQ1NTY5NzczfQ.0PQz71MaczgPe4FH7C6zyoqs3TYg_dB_NNs0OlEgK7g'
        }
      });
      console.log(sol);
      return sol;
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