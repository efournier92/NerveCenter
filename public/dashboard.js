var tabClear = angular.module('tabClear', ['ngRoute', 'gridster', 'pr.longpress']);

tabClear.controller('dashboardController', ['$scope', '$http', function($scope, $http) {
  $scope.onLongPress = function() {
    console.log("DO IT!!");
  };

  $http.get('/defaultWidgets.json').then(function(response) {
    $scope.widgets = response.data;
  });

  $http.get('/gridsterOptions.json').then(function(response) {
    $scope.gridsterOptions = response.data;
  });

}]);
