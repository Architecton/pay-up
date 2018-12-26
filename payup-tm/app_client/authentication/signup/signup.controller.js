// signupCtrl: controller that handles the sign up
(function() {
    function signupCtrl($location, $route, authentication) {
      var vm = this;
    
      // Data needed for signup
      vm.signupData = {
        name: "",
        surname: "",
        username: "",
        gender: "",
        password1: "",
        password2: "",
        email: "",
        acceptTerms: ""
      };
    
      // Regular expression for testing email validity
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
      // sendData: send sign up data to API
      vm.sendData = function() {
        // Validate data.
        vm.formError = "";
        if (!vm.signupData.name || !vm.signupData.surname || !vm.signupData.username || !vm.signupData.password1 || !vm.signupData.password2 || !vm.signupData.email) {
          vm.formError = "Please fill out all the forms.";
          Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          });
          return false;
        } else if (!re.test(String(vm.signupData.email).toLowerCase())) {
          vm.formError = "Invalid email format! Please try again!";
          Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          });
          return false;
        } else if (!vm.signupData.acceptTerms)  {
          vm.formError = "You must accept the terms and conditions to sign up.";
          Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          });
          return false;
        } else if (vm.signupData.password1 != vm.signupData.password2) {
          vm.formError = "Passwords do not match! Please try again.";
          Swal({
            type: 'error',
            title: 'Error',
            text: vm.formError
          });
          return false;
        } else {
          // Format data to form accepted by the API.
          vm.signupData = {
            name: vm.signupData.name.trim(),
            surname: vm.signupData.surname.trim(),
            username: vm.signupData.username.trim(),
            password: [vm.signupData.password1, vm.signupData.password2],
            email: vm.signupData.email.trim(),
            gender: vm.signupData.gender == "Male" ? "m" : "f"
          };
          vm.performSignup();
        }
      };
      
      // Data from reCaptcha responsex
      vm.response = {
        recaptchaResponse: ""
      };
      
      // performSignup: perform sign up
      vm.performSignup = function() {
        vm.formError = "";
        authentication    // Call to service that provides signUp function that makes API call.
          .signUp(vm.signupData, vm.response.recaptchaResponse)
          .then(          // When finished
            function(success) {
              /* global Swal */
              showSignupConfirmation().then(function(result) {
                if(result) {
                  $location.path('/');
                  $route.reload();
                } else {
                  
                }
              });
              
            },
            function(error) {     // Error username is already taken
              vm.formError = error.data.message;
              Swal({
                type: 'error',
                title: 'Error',
                text: 'This username is already taken! Please try another one!'
              });
            }
          );
      };
    }
    
    
    
    // showSignupConfirmation: show successful signup confirmation.
    var showSignupConfirmation = function() {
      return new Promise(function(resolve) {
        Swal({
                title: 'Thank you for signing up for our service!',
                text: 'Please check your inbox for the confirmation e-mail and follow the instructions there!',
                imageUrl: '/style/images/avatar2.png',
                imageWidth: 180,
                imageHeight: 230,
                imageAlt: 'Custom image',
                animation: true
        }).then(function(ok) {
          resolve(true);
        });
      });
    };
  
  signupCtrl.$inject = ['$location', '$route', 'authentication'];
  
  /* global angular */
  angular
    .module('payupApp')
    .controller('signupCtrl', signupCtrl);
})();