// dashboardLoans: get loans displayed on the dashboard
(function() {
  var contactsList = function() {
    // function that gets the contacts of user with specified ID
    var getContacts = function(cbSuccess, cbError) {
      getUser(cbSuccess, cbError);
    };
    // Return function that gets the contacts.
    return {
      getContacts: getContacts
    };
  };
  
    
  // TODO function gets currently logged in user
  var getUser = function(cbSuccess, cbError) {
      // Somehow get logged user ID (username)...
      var idUser = 'jerry12345';
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