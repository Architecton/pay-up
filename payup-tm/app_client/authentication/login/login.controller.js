// loginCtrl: controller that handles the log in
(function() {
  function loginCtrl($location, authentication) {
    var vm = this;

    // TODO
    vm.loginData = {
      username: "",
      password: ""
    };

    vm.homePage = $location.search().page || '/';

    // sendData: send data to the API
    vm.sendData = function() {
      vm.formError = "";
      // If username and password are not present...
      if (!vm.loginData.username || !vm.loginData.password) {
        vm.formError = "Please fill out all the forms.";
        return false;
      } else {
        vm.performLogin();  // Else perform log in with specified data.
      }
    };

    // performLogin: perform log in
    vm.performLogin = function() {
      vm.formError = "";
      authentication
        .login(vm.loginData)        // Log in with specified data
        .then(
          function(success) {       // If successful...
            $location.search('page', null);
            $location.path(vm.homePage);
          },
          function(error) {         // If error...
            vm.formError = error.data.message;
          }
        );
    };
  }
  
  loginCtrl.$inject = ['$location', 'authentication'];

  /* global angular */
  angular
    .module('payupApp')
    .controller('loginCtrl', loginCtrl);
})();