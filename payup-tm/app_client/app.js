(function() {
  
  // Add path specification as a setting of the application.
  function setting($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {  
        templateUrl: 'dashboard/dashboard.view.html',       // Template to add onto layout.pug
        controller: 'dashboardCtrl',
        controllerAs: 'vm'
      })
      .when('/signup', {                                 // Another path
        templateUrl: 'common/views/signupForm.view.html',
        controller: 'signupCtrl',
        controllerAs: 'vm'
      });
    $locationProvider.html5Mode(true);
  }
  
  /* global angular */
  angular
    .module('payupApp', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', setting]);
})();
/* Angular nam omogoča uporabo pogled-modela, kamor lahko povežemo naše podatke, 
tako da ni treba vsega povezovati z globalnim kontekstom objekta $scope.
S takšnim pristopom ohranjamo objekt $scope nenasičen z nepotrebnimi podatki. */

/*
Najprej moramo za takšno funkcionalnost izbrati ime, ki je ponavadi vm,
kar predstavlja okrajšavo za ViewModel, in jo dodamo pri nastavitvi usmerjevalnika.
*/