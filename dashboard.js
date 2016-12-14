var tabClear = angular.module('tabClear', ['ngRoute', 'gridster']);

tabClear.controller('dashboardController', ['$scope', function($scope) {

  const addWidgets = function addWidgets() {
    $scope.widgets = [];
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 5; j++) {
        newWidget = { sizeX: 1,
                      sizeY: 1,
                      row: i,
                      col: j,
                      url: "http://www.cnn.com",
                      icon: "icons/CNN.png"
                    };
        $scope.widgets.push(newWidget);
      }
    }
  };
  addWidgets();
  console.log($scope.widgets);

  $scope.gridOptions = {
    columns: 6,
    pushing: true,
    floating: true,
    swapping: true,
    width: 'auto',
    colWidth: 'auto',
    rowHeight: 'match',
    margins: [10, 10],
    outerMargin: true,
    sparse: false,
    isMobile: false,
    mobileBreakPoint: 600,
    mobileModeEnabled: false,
    minColumns: 1,
    minRows: 1,
    maxRows: 100,
    defaultSizeX: 1,
    defaultSizeY: 1,
    minSizeX: 1,
    maxSizeX: null,
    minSizeY: 1,
    maxSizeY: null,
    resizable: {
      enabled: false,
      handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
      start: function(event, $element, widget) {},
      resize: function(event, $element, widget) {},
      stop: function(event, $element, widget) {}
    },
    draggable: {
      enabled: false,
      handle: '.my-class',
      start: function(event, $element, widget) {},
      drag: function(event, $element, widget) {},
      stop: function(event, $element, widget) {}
    }
  };
}]);

