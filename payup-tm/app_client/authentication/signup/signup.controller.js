// signupCtrl: controller that handles the sign up
(function() {
    function signupCtrl($location, authentication) {
      var vm = this;
    
      // TODO add thata required by the API.
      vm.signupData = {
        ime: "",
        elektronskiNaslov: "",
        geslo: ""
      };
    
      vm.homePage = $location.search().page || '/';
    
      // sendData: send sign up data to API
      vm.sendData = function() {
        vm.formError = "";
        // TODO
        if (!vm.signupData.ime || !vm.signupData.elektronskiNaslov || !vm.signupData.geslo) {
          vm.formError = "Please fill out all the forms.";
          return false;
        } else {
          vm.performSignup();
        }
      };
      
      // performSignup: perform sign up
      vm.performSignup = function() {
        vm.formError = "";
        authentication    // Send POST request with sign up data.
          .signup(vm.signupData)
          .then(          // When finished
            function(success) {
              $location.search('page', null);
              $location.path(vm.homePage);
            },
            function(error) {     // Error
              vm.formError = error.data.message;
            }
          );
      };
    }
    
  /* global angular */
  angular
    .module('payupApp')
    .controller('signupCtrl', signupCtrl);
})();