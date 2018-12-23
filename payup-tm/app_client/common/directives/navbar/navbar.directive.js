(function() {
  var navbar = function() {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/navbar/navbar.template.html'
    };
  };
  
  /* global angular */
  angular
    .module('payupApp')
    .directive('navbar', navbar);
})();