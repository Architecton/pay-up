// authentication service

// authentication:
(function() {
  function contactManagement($http, authentication) {
    
    // editNotes: edit notes of contact with specified idContact of user with specified idUser.
    var editNotes = function(idUser, idContact, notes) {
      return $http.put('/api/users/' + idUser + '/contacts/' + idContact, notes, {
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        }
      }).then(
        function success(response) {
          console.log(response.data);
        });
    };
    
    // addContact: add new contact to specified user's list of contacts
    var addContact = function(idUser, contactData) {
        console.log(contactData);
        return $http.post('/api/users/' + idUser + '/contacts', contactData, {
            headers: {
                Authorization: 'Bearer ' + authentication.getToken()
            }
        }).then(function success(response) {
           console.log(response.data); 
        });
    };
    
    var deleteContact = function(idUser, idContact) {
        return $http.delete('/api/users/' + idUser + '/contacts/' + idContact, {
            headers: {
                Authorization: 'Bearer ' + authentication.getToken()
            }
        }).then(function success(response) {
           console.log(response.data); 
        });
    };
    
    // Return object containing the functions offered by this service.
    return {
      editNotes: editNotes,
      addContact: addContact,
      deleteContact: deleteContact
    };
  }
  
  // Register service
  /* global angular */
  angular
    .module('payupApp')
    .service('contactManagement', contactManagement);
})();