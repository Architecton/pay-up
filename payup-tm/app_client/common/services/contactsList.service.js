// dashboardLoans: get loans displayed on the dashboard
(function() {
  var contactsList = function() {
    // function that gets the contacts of user with specified ID
    var getContacts = function(cbSuccess, cbError, idUser, pageIndex) {
      getUser(cbSuccess, cbError, idUser, pageIndex);
    };
    // Return function that gets the contacts.
    return {
      getContacts: getContacts
    };
  };
  
  
  var getUser = function(cbSuccess, cbError, idUser, pageIndex) {
      if (idUser) {
        cbSuccess(idUser, pageIndex);
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