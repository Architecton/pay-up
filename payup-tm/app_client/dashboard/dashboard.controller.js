function dashboardCtrl($scope) {
  $scope.header = {
    title: 'PayUp',
    subtitle: 'Test!'
  };
  $scope.sidebar = 'Another test!';
}

/* global payupApp */
payupApp
  .controller('dashboardCtrl', dashboardCtrl);