// dashboardLoans: get loans displayed on the dashboard
(function() {
  var loansList = function() {
    // function that gets the loans to be displayed on the dashboard page.
    var getLoans = function(cbSuccess, cbError) {
      getUser(cbSuccess, cbError);
    };
    // Return function that gets the loans to be displayed on the dashboard page.
    return {
      getLoans: getLoans
    };
  };
  
    
    
  // TODO function gets currently logged in user
  var getUser = function(cbSuccess, cbError) {
      // Somehow get logged user ID (sername)...
      var idUser = 'gozdnijoza97';
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
    .service('loansList', loansList);

})();