// loansCtrl: loans page controller
(function() {
  function dbCtrl($scope, $location, $route, testHelper, authentication) {
    var vm = this;
    
    
    // NIGHT MODE /////////////
    angular.element(document).ready(function () {
      if (authentication.isLoggedIn() && authentication.currentUser().nightmode) {
        document.getElementsByClassName("globalBackground")[0].style.backgroundColor = 'black';
        document.getElementsByClassName("globalBackground")[1].style.backgroundColor = 'black';
      }
    });
    ///////////////////////////
    
    
    // nukeDB: remove all users from the database
    vm.nukeDB = function() {
      /* global Swal */
      // Prompt user to confirm.
      Swal({
        title: 'Whoa!!!!!',
        text: "Are you sure you want to press the NUKE button?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YES!'
      }).then(function(result) {
        if (result.value) {
          var timerInterval;
            Swal({
              title: 'NUKING DATABASE!!!',
              html: 'DATABASE WILL BE NUKED IN <strong></strong> MILLISECONDS!!!!',
              timer: 2000,
              onBeforeOpen: function() {
                Swal.showLoading();
                timerInterval = setInterval(function() {
                  Swal.getContent().querySelector('strong')
                    .textContent = Swal.getTimerLeft();
                }, 100);
              },
              onClose: function() {
                clearInterval(timerInterval);
              }
            }).then(function(result) {
              if (
                result.dismiss === Swal.DismissReason.timer
              ) {
                // Make call to service and log user out.
                testHelper.nuke().then(
                  function success(response) {  // If successful
                    authentication.logOut();
                    $location.path('/');
                    $route.reload();
                  }, function error(response) {  // else if error
                    Swal({
                      type: 'error',
                      title: 'WHAT???',
                      text: 'You are not authorized to press this button! Who exactly do you think you are?!'
                    }).then(function(ok) {
                      $location.path('/');
                      $route.reload();
                    });
                  }
                );
              }
          });
        }
      });
    };
    
    // fillDB: add testing data to the database
    vm.fillDB = function() {
      Swal({
        title: 'Whoa!!!!!',
        text: "Are you sure you want to press this strange looking button?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'YES!'
      }).then(function (ok) {
        // Make call to service.
        testHelper.fill().then(
          function success(response) {  // If response successfuly retrieved...
            vm.filled = true;
            Swal({
              title: 'Hmmmmm...',
              text: 'I wonder what just happened?',
              imageUrl: 'style/images/plant.jpeg',
              imageWidth: 400,
              imageHeight: 200,
              imageAlt: 'Custom image',
              animation: false
            }).then(function(ok) {
              vm.filled = true;
              $location.path('/');
              $route.reload();
            });
          }, function error(response) {  // else if error...
            console.log(response.status);
            Swal({
              type: 'error',
              title: 'WHAT???',
              text: response.status == 400 ? 'You\'ve already done this, haven\'t you??' : 'You are not authorized to press this button! Who exactly do you think you are?!'
            }).then(function(ok) {
              $location.path('/');
              $route.reload();
            }); 
          }
        );
      });
    };
  }
  
  dbCtrl.$inject = ['$scope', '$location', '$route', 'testHelper', 'authentication'];  
  
  // Add controller to the app
  /* global angular */
  angular
    .module('payupApp')
    .controller('dbCtrl', dbCtrl);
})();