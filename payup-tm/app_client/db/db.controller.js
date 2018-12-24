// loansCtrl: loans page controller
(function() {
  function dbCtrl($scope, $location, $route, testHelper, authentication) {
    var vm = this;
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
      }).then((result) => {
        if (result.value) {
          let timerInterval;
            Swal({
              title: 'NUKING DATABASE!!!',
              html: 'DATABASE WILL BE NUKED IN <strong></strong> SECONDS!!!!',
              timer: 2000,
              onBeforeOpen: () => {
                Swal.showLoading();
                timerInterval = setInterval(() => {
                  Swal.getContent().querySelector('strong')
                    .textContent = Swal.getTimerLeft();
                }, 100);
              },
              onClose: () => {
                clearInterval(timerInterval);
              }
            }).then((result) => {
              if (
                result.dismiss === Swal.DismissReason.timer
              ) {
                // Make call to service and log user out.
                testHelper.nuke().then(
                  function success(response) {  // If successful
                    if (response == false){
                      Swal({
                        type: 'error',
                        title: 'WHAT???',
                        text: 'You are not authorized to press this button! Who exactly do you think you are?!'
                      }).then(ok => {
                        $location.path('/');
                        $route.reload();
                      });  
                    }
                    authentication.logOut();
                    $location.path('/');
                    $route.reload();
                  }, function error(response) {  // else if error
                    Swal({
                      type: 'error',
                      title: 'WHAT???',
                      text: 'You are not authorized to press this button! Who exactly do you think you are?!'
                    }).then(ok => {
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
      // Make call to service.
      testHelper.fill().then(
        function success(response) {  // If response successfuly retrieved...
          // todo Swal
        }, function error(response) {  // else if error...
          
        }
      );
    };
  }

  
  // Add controller to the app
  /* global angular */
  angular
    .module('payupApp')
    .controller('dbCtrl', dbCtrl);
})();