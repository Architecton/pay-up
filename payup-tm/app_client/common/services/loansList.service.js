// dashboardLoans: get loans displayed on the dashboard
(function() {
  var loansList = function() {
    // function that gets the loans to be displayed on the dashboard page.
    var getLoans = function(cbSuccess, cbError, idUser, pageIndex, filterIndex) {
      getUser(cbSuccess, cbError, idUser, pageIndex, filterIndex);
    };
    // Return function that gets the loans to be displayed on the dashboard page.
    return {
      getLoans: getLoans
    };
  };
  
  
  var getUser = function(cbSuccess, cbError, idUser, pageIndex, filterIndex) {
      if (idUser) {
        // second argument is the page index
        cbSuccess(idUser, pageIndex, filterIndex);
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