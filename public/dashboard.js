var tabClear = angular.module('tabClear', ['ngRoute', 'gridster']);

tabClear.controller('dashboardController', ['$scope', function($scope) {
  $scope.standardItems = [
    { sizeX: 1, sizeY: 1, row: 0, col: 0 },
    { sizeX: 1, sizeY: 1, row: 0, col: 1 },
    { sizeX: 1, sizeY: 1, row: 0, col: 2 },
    { sizeX: 1, sizeY: 1, row: 0, col: 3 },
    { sizeX: 1, sizeY: 1, row: 0, col: 4 },
    { sizeX: 1, sizeY: 1, row: 2, col: 0 },
    { sizeX: 1, sizeY: 1, row: 2, col: 1 },
    { sizeX: 1, sizeY: 1, row: 2, col: 2 },
    { sizeX: 1, sizeY: 1, row: 2, col: 3 },
    { sizeX: 1, sizeY: 1, row: 2, col: 4 },
  ];


  const addWidgets = function addWidgets() {
    $scope.widgets = [];
    for (i = 0; i < 1; i++) {
      for (j = 0; j < 5; j++) {
        newWidget = { sizeX: 1, sizeY: 1, row: i, col: j };
        $scope.widgets.push(newWidget);
      }
    }
  };
  addWidgets();
  console.log($scope.widgets);
}]);

