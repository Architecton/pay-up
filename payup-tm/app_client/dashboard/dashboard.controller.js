// dashboardCtrl: dashboard page controller
(function() {
  function dashboardCtrl($scope, loansData, loansList, authentication) {
    // Pogled-model se generira ob kreiranju novega primerka krmilnika, zato lahko do njega preprosto dostopamo z this
    var vm = this;
    
    
    // PAGINATION ////////////////////////////
      
    vm.currentPage = 1;  
    
    // number of user's loans (retrieved from call to api)
    vm.numLoans = 0;
    // get number of active loans
    loansData.numActiveLoans(authentication.currentUser().username, 'active').then(function succes(response) {
      vm.numLoans = Number(response.headers('numLoans'));
    });
    vm.itemsPerPage = 10;                     // The number of returned results is hard coded in API (for now).
    vm.pageChange = function(currentPage) {   // Handle page change in view by retrieving the relevant page. 
      vm.getListLoans(Number(currentPage)-1, 0); // Get page of loans (no filter)
    };
    //////////////////////////////////////////
    
    
    
    // getData; get selected loans of user with ID idUser
    vm.getData = function(idUser) {
      // Make GET request to retrieve loans data.
      loansData.loans(idUser, vm.currentPage-1, 0).then(
        function success(response) {  // If response successfuly retrieved...
          vm.message = response.data.length > 0 ? "" : "No active loans found.";  // If at least one loan found, set empty message.
          // Data to be exposed
          vm.data = {                                                             // selectedLoans are the loans in the HTTP response to the GET request.
            // Return active loans sorted by the loan amount.
            selectedLoans: response.data.filter(function(loan) { return loan.status == 'active' }).sort(function(a,b) { return (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0)})
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
    
    // NIGHT MODE //////////////
    angular.element(document).ready(function () {
      if (authentication.currentUser().nightmode) {
        document.getElementsByClassName("globalBackground")[0].style.backgroundColor = 'black';
        document.getElementsByClassName("globalBackground")[1].style.backgroundColor = 'black';
      }
    });
    ////////////////////////////
  
    // Call to service function that retrieves the loans to be displayed on the dashboard.
    loansList.getLoans(             // Pass getData and showError functions
      vm.getData, 
      vm.showError,
      authentication.currentUser().username,
      vm.currentPage-1,
      0);
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