// dashboardCtrl: dashboard page controller
(function() {
  function dashboardCtrl($scope, loansData, loansList, authentication) {
    // Pogled-model se generira ob kreiranju novega primerka krmilnika, zato lahko do njega preprosto dostopamo z this
    var vm = this;
    
    // getData; get selected loans of user with ID idUser
    vm.getData = function(idUser) {
      // Make GET request to retrieve loans data.
      loansData.loans(idUser).then(
        function success(response) {  // If response successfuly retrieved...
          vm.message = response.data.length > 0 ? "" : "No active loans found.";  // If at least one loan found, set empty message.
          // Data to be exposed
          vm.data = {                                                             // selectedLoans are the loans in the HTTP response to the GET request.
            // Return active loans sorted by the loan amount.
            selectedLoans: response.data.filter(loan => loan.status == 'active').sort((a,b) => (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0))
          };
        }, function error(response) {  // else if error...
          vm.message = "Error";
          console.log(response.e);
        }
      );
    };
  
    // Show error message
    vm.showError = function(error) {
      $scope(function() {
        vm.message = error.message;
      });
    };
  
    // Call to service function that retrieves the loans to be displayed on the dashboard.
    loansList.getLoans(             // Pass getData and showError functions
      vm.getData, 
      vm.showError,
      authentication.currentUser().username);
  }
  
  dashboardCtrl.$inject = ['$scope', 'loansData', 'loansList', 'authentication'];

  
  // Add controller to the app
  /* global angular */
  angular
    .module('payupApp')
    .controller('dashboardCtrl', dashboardCtrl);
})();
  
/*
Control Flow:
  1. Call service loansList (loansList.service.js) with function that gets list of loans given user's ID and function that is called if encountered error
  2. getLoans function passes the above functions to a function that retrieves the currently logged in user and calls the 
     function that gets list of loans given user's ID with the retrieved ID of the currently logged in user.
*/