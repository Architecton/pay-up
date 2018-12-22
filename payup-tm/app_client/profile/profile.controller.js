// dashboardCtrl: dashboard page controller
function profileCtrl($scope, profileData, userInfo) {
  // Pogled-model se generira ob kreiranju novega primerka krmilnika, zato lahko do njega preprosto dostopamo z this
  var vm = this;
  // getData; get info of user with ID idUser (to display on profile page)
  vm.getData = function(idUser) {
    // Make GET request to retrieve info about the user.
    profileData.profile(idUser).then(
      function success(response) {  // If response successfuly retrieved...
        vm.message = response.data.length > 0 ? "" : "Problem retrieving data";
        // Data to be exposed
        vm.data = {                                                             // userData is the data in the HTTP response to the GET request.
          userData: response.data
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

  // Call to service function that retrieves the info to be displayed on the profile page
  userInfo.getInfo(             // Pass getData and showError functions
    vm.getData, 
    vm.showError);
}

// Add controller to the app
/* global payupApp */
payupApp
  .controller('lprofileCtrl', profileCtrl);