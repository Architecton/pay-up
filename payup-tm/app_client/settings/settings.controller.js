// dashboardCtrl: dashboard page controller
function settingsCtrl($scope, settingsData, settingsInfo) {
  // Pogled-model se generira ob kreiranju novega primerka krmilnika, zato lahko do njega preprosto dostopamo z this
  var vm = this;
  // getData; get selected loans of user with ID idUser
  vm.getData = function(idUser) {
    // Make GET request to retrieve settings data.
    settingsData.settings(idUser).then(
      function success(response) {  // If response successfuly retrieved...
        vm.message = response.data.length > 0 ? "" : "Error retrieving data";   // If response body is empty
        // Data to be exposed
        vm.data = {
          selectedLoans: {
              nightmode: response.data.nightmode,
              defaultCurrency: response.data.defaultCurrency
          }
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
  settingsInfo.getSettings(             // Pass getData and showError functions
    vm.getData, 
    vm.showError);
}

// Add controller to the app
/* global payupApp */
payupApp
  .controller('settingsCtrl', settingsCtrl);