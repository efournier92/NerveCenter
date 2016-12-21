var tabClear = angular.module('tabClear', ['ngRoute', 'gridster', 'pr.longpress']);

tabClear.controller('dashboardController', ['$scope', '$http', function($scope, $http) {
  $scope.onLongPress = function() {
    console.log("DO IT!!");
  };

  $http({
    method: 'GET',
    url: '/gridsterOptions.json'
  }).then(function successCallback(response) {
    $scope.gridsterOptions = response;
  }, function errorCallback(response) {
  });

  $http({
    method: 'GET',
    url: '/defaults.json'
  }).then(function successCallback(response) {
    $scope.widgets = response;
    console.log($scope.widgets)
  }, function errorCallback(response) {
  });
}]);
