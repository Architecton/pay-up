// homepageCtrl
(function() {
  function homepageCtrl($scope, authentication) {
    angular.element(document).ready(function () {
      if (authentication.isLoggedIn() && authentication.currentUser().nightmode) {
        document.getElementsByClassName("globalBackground")[0].style.backgroundColor = 'black';
        document.getElementsByClassName("globalBackground")[1].style.backgroundColor = 'black';
      }
    });
  }
  homepageCtrl.$inject = ['$scope', 'authentication'];

  
  // Add controller to the app
  /* global angular */
  angular
    .module('payupApp')
    .controller('homepageCtrl', homepageCtrl);
})();