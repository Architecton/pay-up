// dashboardLoans: get loans displayed on the dashboard
(function() {
  var loansList = function() {
    // function that gets the loans to be displayed on the dashboard page.
    var getLoans = function(cbSuccess, cbError, idUser) {
      getUser(cbSuccess, cbError, idUser);
    };
    // Return function that gets the loans to be displayed on the dashboard page.
    return {
      getLoans: getLoans
    };
  };
  
  
  var getUser = function(cbSuccess, cbError, idUser) {
      if (idUser) {
        // second argument is the page index
        cbSuccess(idUser, 0);
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
    .service('loansList', loansList);

})();