// dashboardLoans: get loans displayed on the dashboard
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

// Add service to app.
/* global payupApp */
payupApp
  .service('loansList', loansList);
  
  
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