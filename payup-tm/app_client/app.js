/* global angular */
var payupApp = angular.module('payup', []);

// Add path specification as a setting of the application

function setting($routeProvider) {
  $routeProvider
    .when('/', {})                  // When request /, go to root.
    .otherwise({redirecTo: '/'});   // When request anything else, also redirect to root.
}

payupApp
  .config(['$routeProvider', setting]);
