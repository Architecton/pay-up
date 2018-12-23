(function() {
  var modal = function() {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/modal/modal.template.html'
    };
  };
  
  /* global angular */
  angular
    .module('payupApp')
    .directive('modal', modal);
})();