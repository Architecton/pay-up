// dashboardCtrl: dashboard page controller
function contactsCtrl($scope, contactsData, contactsList) {
  // Pogled-model se generira ob kreiranju novega primerka krmilnika, zato lahko do njega preprosto dostopamo z this
  var vm = this;
  // getData; get selected loans of user with ID idUser
  vm.getData = function(idUser) {
    // Make GET request to retrieve loans data.
    contactsData.contacts(idUser).then(
      function success(response) {  // If response successfuly retrieved...
        vm.message = response.data.length > 0 ? "" : "No contacts found.";         // If at least one loan found, set empty message.
        // Data to be exposed
        vm.data = {                                                             // selectedLoans are the loans in the HTTP response to the GET request.
          selectedLoans: response.data
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
  contactsList.getContacts(             // Pass getData and showError functions
    vm.getData, 
    vm.showError);
}

// Add controller to the app
/* global payupApp */
payupApp
  .controller('contactsCtrl', contactsCtrl);