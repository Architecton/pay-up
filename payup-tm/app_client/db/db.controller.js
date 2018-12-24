// loansCtrl: loans page controller
(function() {
  function dbCtrl($scope, testHelper) {
    var vm = this;
    
    // nukeDB: remove all users from the database
    vm.nukeDB = function() {
      // Prompt user to confirm.
      
      
      // Make call to service.
      testHelper.nuke().then(
        function success(response) {  // If successful
          // TODO Swal
          
          
        }, function error(response) {  // else if error
          
        }
      );
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
  
  dbCtrl.$inject = ['$scope', 'testHelper'];

  
  // Add controller to the app
  /* global angular */
  angular
    .module('payupApp')
    .controller('dbCtrl', dbCtrl);
})();