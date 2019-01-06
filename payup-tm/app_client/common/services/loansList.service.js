// dashboardLoans: get loans displayed on the dashboard
(function() {
  var loansList = function() {
    // function that gets the loans to be displayed on the dashboard page.
    var getLoans = function(cbSuccess, cbError, idUser, pageIndex) {
      getUser(cbSuccess, cbError, idUser, pageIndex);
    };
    // Return function that gets the loans to be displayed on the dashboard page.
    return {
      getLoans: getLoans
    };
  };
  
  
  var getUser = function(cbSuccess, cbError, idUser, pageIndex) {
      if (idUser) {
        // second argument is the page index
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
    .service('loansList', loansList);

})();