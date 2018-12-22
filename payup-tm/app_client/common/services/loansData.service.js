var loansData = function($http) {
  var loans = function(idUser) {
    return $http.get('/api/users/' + idUser + '/loans');
  };
  return {
    loans: loans
  };
};

/* global payupApp */
payupApp
  .service('loansData', loansData);