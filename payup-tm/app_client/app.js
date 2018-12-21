/* global angular */
var payupApp = angular.module('payup', ['ngRoute']);

// Add path specification as a setting of the application.
function setting($routeProvider) {
  $routeProvider
    .when('/dashboard', {  
      templateUrl: 'dashboard/dashboard.view.html',       // Template to add onto layout.pug
      controller: 'dashboardCtrl'
    }).when('/tralala', {                                 // Another path
      templateUrl: 'dashboard/dashboard.view.html',
      controller: 'dashboardCtrl'
    })
    .otherwise({redirectTo: '/'});                        // If none of the paths match - (TODO render general 404 page)
}


// Add route provider configurations to app.
payupApp
  .config(['$routeProvider', setting]);