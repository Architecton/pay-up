// loansCtrl: loans page controller
(function() {
  function loansCtrl($scope, loansData, loansList) {
    // Pogled-model se generira ob kreiranju novega primerka krmilnika, zato lahko do njega preprosto dostopamo z this
    var vm = this;
    
    // getData; get selected loans of user with ID idUser
    vm.getData = function(idUser) {
      // Make GET request to retrieve loans data.
      loansData.loans(idUser).then(
        function success(response) {  // If response successfuly retrieved...
          vm.message = response.data.length > 0 ? "" : "No active loans found.";  // If response empty
          // Data to be exposed
          vm.data = {
            // Return user's loans
            loans: response.data
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
  
    loansList.getLoans(             // Pass getData and showError functions
      vm.getData, 
      vm.showError);
  }
  
  loansCtrl.$inject = ['$scope', 'loansData', 'loansList'];

  
  // Add controller to the app
  /* global angular */
  angular
    .module('payupApp')
    .controller('loansCtrl', loansCtrl);
})();