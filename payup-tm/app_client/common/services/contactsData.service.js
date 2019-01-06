(function() {
  var contactsData = function($http, authentication) {
    var contacts = function(idUser, pageIndex) {
      return $http.get('/api/users/' + idUser + '/contacts/' + pageIndex, {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      });
    };
    return {
      contacts: contacts
    };
  };
  
  contactsData.$inject = ['$http', 'authentication'];
  
  /* global angular */
  angular
    .module('payupApp')
    .service('contactsData', contactsData);
})();