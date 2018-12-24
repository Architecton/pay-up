// signupCtrl: controller that handles the sign up
(function() {
    function signupCtrl($location, $route, authentication) {
      var vm = this;
    
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
        console.log(vm.signupData);
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
      
      // performSignup: perform sign up
      vm.performSignup = function() {
        console.log(vm.signupData);
        vm.formError = "";
        authentication    // Send POST request with sign up data.
          .signUp(vm.signupData)
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
    
    var showSignupConfirmation = function() {
      return new Promise(function(resolve) {
        Swal({
                title: 'Thank you for signing up for our service!',
                text: 'Please check your inbox for the confirmation e-mail and follow the instructions there!',
                imageUrl: 'https://unsplash.it/400/200',
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Custom image',
                animation: true
        }).then(ok => {
          resolve(true);
        });
      });
    };
    
  /* global angular */
  angular
    .module('payupApp')
    .controller('signupCtrl', signupCtrl);
})();