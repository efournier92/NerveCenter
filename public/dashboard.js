var tabClear = angular.module('tabClear', ['ngRoute']);

tabClear.controller('dashboardController', ['$scope', function($scope) {
  $scope.example = "IT FINALLY WORKS"
  $scope.standardItems = [
    { sizeX: 1, sizeY: 1, row: 0, col: 0 },
    { sizeX: 1, sizeY: 1, row: 0, col: 1 },
    { sizeX: 1, sizeY: 1, row: 0, col: 2 },
    { sizeX: 1, sizeY: 1, row: 0, col: 3 },
    { sizeX: 1, sizeY: 1, row: 0, col: 4 },
    { sizeX: 1, sizeY: 1, row: 0, col: 5 },
    { sizeX: 1, sizeY: 1, row: 0, col: 6 },
    { sizeX: 1, sizeY: 1, row: 2, col: 0 },
    { sizeX: 1, sizeY: 1, row: 2, col: 1 },
    { sizeX: 1, sizeY: 1, row: 2, col: 2 },
    { sizeX: 1, sizeY: 1, row: 2, col: 3 },
    { sizeX: 1, sizeY: 1, row: 2, col: 4 },
    { sizeX: 1, sizeY: 1, row: 2, col: 5 },
    { sizeX: 1, sizeY: 1, row: 2, col: 6 },
  ];
}]);


