(function() {
  var modal = function() {
    return {
      restrict: 'EA',
      templateUrl: '/common/directives/modal/modal.template.html',
      controller: 'modalCtrl',
      controllerAs: 'modvm'
    };
  };
  
  /* global angular */
  angular
    .module('payupApp')
    .directive('modal', modal);
})();