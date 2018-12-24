(function() {
  
  // Add path specification as a setting of the application.
  function setting($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl:'homepage/homepage.view.html'
      })
      .when('/dashboard', {  
        templateUrl: 'dashboard/dashboard.view.html',
        controller: 'dashboardCtrl',
        controllerAs: 'vm'
      })
      .when('/signup', {
        templateUrl: 'authentication/signup/signup.view.html',
        controller: 'signupCtrl',
        controllerAs: 'vm'
      })
      .when('/loans', {
        templateUrl: 'loans/loans.view.html',
        controller: 'loansCtrl',
        controllerAs: 'vm'
      })
      .when('/comingsoon', {
        templateUrl: 'comingsoon/comingsoon.view.html'
      })
      .when('/contacts', {
        templateUrl: 'contacts/contacts.view.html',
        controller: 'contactsCtrl',
        controllerAs: 'vm'
      })
      .when('/patchnotes', {
        templateUrl: 'patchnotes/patchnotes.view.html'
      })
      .when('/db', {
        templateUrl: 'db/db.view.html',
        controller: "dbCtrl",
        controllerAs: 'vm'
      });
    $locationProvider.html5Mode(true);
  }
  
  /* global angular */
  angular
    .module('payupApp', ['ngRoute', 'ngSanitize'])
    .config(['$routeProvider', '$locationProvider', setting]);
})();
/* Angular nam omogoča uporabo pogled-modela, kamor lahko povežemo naše podatke, 
tako da ni treba vsega povezovati z globalnim kontekstom objekta $scope.
S takšnim pristopom ohranjamo objekt $scope nenasičen z nepotrebnimi podatki. */

/*
Najprej moramo za takšno funkcionalnost izbrati ime, ki je ponavadi vm,
kar predstavlja okrajšavo za ViewModel, in jo dodamo pri nastavitvi usmerjevalnika.
*/