// dashboardLoans: get loans displayed on the dashboard
(function() {
  var contactsList = function() {
    // function that gets the contacts of user with specified ID
    var getContacts = function(cbSuccess, cbError, idUser) {
      getUser(cbSuccess, cbError, idUser);
    };
    // Return function that gets the contacts.
    return {
      getContacts: getContacts
    };
  };
  
    
  // TODO function gets currently logged in user
  var getUser = function(cbSuccess, cbError, idUser) {
      if (idUser) {
        cbSuccess(idUser);
      } else {
        var error;
        error.message = "idUser missing";
        cbError(error);
      }
  };

  // Add service to app.
  /* global angular */
  angular
    .module('payupApp')
    .service('contactsList', contactsList);
})();