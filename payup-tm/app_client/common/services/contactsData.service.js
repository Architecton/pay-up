(function() {
  var contactsData = function($http, authentication) {
    // contacts: get specified page of user's contacts.
    var contacts = function(idUser, pageIndex) {
      return $http.get('/api/users/' + idUser + '/contacts/' + pageIndex, {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      });
    };
    
    // Make HEAD request to server to get number of user's contacts.
    var numContacts = function(idUser) {
      return $http.head('/api/users/' + idUser + '/contacts', {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      }).then(function success(response) {
        return response;
      }, function error(response) {
        return response;
      });
    };
    return {
      contacts: contacts,
      numContacts: numContacts
    };
  };
  
  contactsData.$inject = ['$http', 'authentication'];
  
  /* global angular */
  angular
    .module('payupApp')
    .service('contactsData', contactsData);
})();