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
    
    // getSearchList: get list of all user's names, surnames and usernames
    var getSearchList = function() {
      return $http.get('/api/users', {
        headers: {
                Authorization: 'Bearer ' + authentication.getToken()
          }
      });
    };
    
    // Return object containing the functions offered by this service.
    return {
      editNotes: editNotes,
      addContact: addContact,
      deleteContact: deleteContact,
      getSearchList: getSearchList
    };
  }
  
  // Register service
  /* global angular */
  angular
    .module('payupApp')
    .service('contactManagement', contactManagement);
})();