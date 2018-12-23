(function() {
  function navbarCtrl($location, authentication, $route) {
    var navvm = this;
    
    navvm.currentLocation = $location.path();
    
    navvm.isLoggedIn = authentication.isLoggedIn();
    
    navvm.currentUser = authentication.currentUser();

    navvm.logOut = function() {
      authentication.logOut();
      $location.path('/');
      $route.reload();
    };
  }
  navbarCtrl.$inject = ['$location', 'authentication', '$route'];

  /* global angular */
  angular
    .module('payupApp')
    .controller('navbarCtrl', navbarCtrl);
})();