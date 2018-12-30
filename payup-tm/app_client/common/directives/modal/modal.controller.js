// modalCtrl: controller that handles the log in
(function() {
  function modalCtrl($scope, $uibModal, $location, authentication, $route) {
    var modvm = this;
    
    modvm.loginModalShow = function() {
      modvm.loginModal = $uibModal.open({
        animation: true,
        templateUrl: 'common/directives/modal/login.html',
        windowClass: 'app-modal-window',
        controller: 'ModalInstanceCtrl',
        controllerAs: 'modctrl'
      });
      modvm.loginModal.result.then(function(){
         
       }, function(){
         
       });
    };
    
    modvm.profileModalShow = function() {
      modvm.profileModal = $uibModal.open({
        animation: true,
        templateUrl: 'common/directives/modal/profile.html',
        windowClass: 'app-modal-window',
        controller: 'ModalInstanceCtrl',
        controllerAs: 'modctrl'
      });
      modvm.profileModal.result.then(function(){
         
       }, function(){
         
       });
    };
    
    modvm.settingsModalShow = function() {
      modvm.settingsModal = $uibModal.open({
        animation: true,
        templateUrl: 'common/directives/modal/settings.html',
        windowClass: 'app-modal-window',
        controller: 'ModalInstanceCtrl',
        controllerAs: 'modctrl'
      });
       modvm.settingsModal.result.then(function(){
         
       }, function(){
         
       });
    };
    
    modvm.termsModalShow = function() {
      modvm.termsModal = $uibModal.open({
        animation: true,
        templateUrl: 'common/directives/modal/terms.html',
        windowClass: 'app-modal-window',
        controller: 'ModalInstanceCtrl',
        controllerAs: 'modctrl'
      });
      modvm.termsModal.result.then(function(){
         
       }, function(){
         
       });
    };

    modvm.loggedUser = authentication.currentUser();
    modvm.defaultCurrency = "";
    
    // If user is logged in, get default currency
    if (authentication.isLoggedIn()) {
      modvm.defaultCurrency = authentication.currentUser().defaultCurrency;
    }
    
    // set night mode checkbox
    angular.element(document).ready(function () {
      if (authentication.isLoggedIn()) {
        document.getElementById("nightmode").checked = authentication.currentUser().nightmode;
      }
    });
    
    // Data needed to log in
    modvm.loginData = {
      username: "",
      password: ""
    };

    // sendData: send data to the API
    modvm.sendData = function() {
      modvm.formError = "";
      // If username and password are not present...
      if (!modvm.loginData.username || !modvm.loginData.password || modvm.loginData.username == "" || modvm.loginData.password == "") {
        modvm.formError = "Please fill out all the forms.";
        return false;
      } else {
        modvm.performLogin();  // Else perform log in with specified data.
      }
    };
    
    
    modvm.open = function (size) {
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        controller: 'ModalInstanceC',
        controllerAs: 'vm',
        size: size,
        resolve: {
          data: function () {
            return modvm.data;
          }
        }
      });
  
      modalInstance.result.then(function () {
        alert("now I'll close the modal");
      });
    };
    
    

    // performLogin: perform log in
    modvm.performLogin = function() {
      modvm.formError = "";
      authentication
        .logIn(modvm.loginData)        // Log in with specified data
        .then(
          function(success) {       // If successful...
            // Show confirmation alert
            /* global Swal  */
            Swal({
              title: 'Welcome back!',
              text: 'We missed you! See what\'s new by navigating to your dashboard!',
              imageUrl: '/style/images/avatar2.png',
              imageWidth: 180,
              imageHeight: 230,
              imageAlt: 'Custom image',
              animation: true
            }).then(function(ok) {
              // Redirect user to dashboard.
              document.getElementById('id01').style.display='none';
              $location.path('/dashboard');
              $route.reload();  
            });
            
          },
          function(error) {         // If error...
            Swal({
              title: 'Invalid username or password!',
              text: 'Make sure you have validated your account by following the link that was sent to your e-mail address.',
              type: 'error'
            });
          }
        );
    };
    
    // Account deletion ////////////////////////////////////////////
    
    // deleteAccount: delete user's account.
    modvm.deleteAccount = function() {
      // Get currently logged in user.
      currentUser = authentication.currentUser();
      console.log(currentUser);
      // Prompt user to confirm action.
      Swal({
        title: 'Are you sure you want to delete your account?',
        text: "You will not be able to undo this action.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Delete Account'
      }).then(function(result) {
        console.log(result);
        // If user confirmed
        if (result.value) {
          // Try to delete account.
          authentication.
            deleteAccount(currentUser.username)
            .then(function(success) {   // If successfuly deleted
                Swal({
                  title: 'Account deleted!',
                  text: 'We will miss you! Please don\'t hesitate to contact us if you have any complaints about our service.',
                  type: 'success'
                }).then(function(ok) {
                  // Redirect to homepage
                  document.getElementById('id03').style.display='none';
                  $location.path('/');
                  $route.reload();
                });
            }, function(error) {
                Swal({
                  title: 'Error',
                  text: 'Something went wrong. Please try again.',
                  type: 'error'
                });
            });
          }
      });
    };
    ///////////////////////////////////////////////
    
    
    
    modvm.settingsValues = {
      nightmode: false,
      defaultCurrency: ""
    };
    
    modvm.updateSettings = function() {
      // Get user id
      var idUser = authentication.currentUser().username;
      // Get currency.
      modvm.settingsValues.defaultCurrency= document.getElementById("settingsCurrencySel").value;
      console.log(modvm.settingsValues);
      if (idUser && modvm.settingsValues.defaultCurrency) {
        if (typeof modvm.settingsValues.nightmode == 'boolean' && modvm.settingsValues.defaultCurrency.replace(/^\s+|\s+$/g, '').length > 0) {
          authentication.updateSettings(idUser, modvm.settingsValues).then(function success(response) {
            Swal({
              title: 'Your settings have been saved!',
              text: 'Please log in again for the changes to take effect!',
              type: 'success'
            }).then(function(ok) {
              document.getElementById('id02').style.display='none';
                authentication.logOut();
                $location.path('/');
                $route.reload();
            });
          }, function error(response) {
            Swal({
              title: 'Error',
              text: 'Something went wrong. Please try again.',
              type: 'error'
            });
          });
        } else {
          Swal({
            title: 'Error',
            text: 'Something went wrong. Please try again.',
            type: 'error'
          });
        }
      } else {
        Swal({
          title: 'Error',
          text: 'Something went wrong. Please try again.',
          type: 'error'
        });
      }
    };
  }
  
  modalCtrl.$inject = ['$scope', '$uibModal', '$location', 'authentication', '$route'];

  /* global angular */
  angular
    .module('payupApp')
    .controller('modalCtrl', modalCtrl);
})();


angular.module('payupApp').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
  var modctrl = this;
  modctrl.cancel = function () {
    $uibModalInstance.dismiss();
  };
});