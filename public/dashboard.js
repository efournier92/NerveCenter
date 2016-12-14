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

  $scope.gridsterOpts = {
    columns: 6,
    pushing: true,
    floating: true,
    swapping: true,
    width: 1, // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
    colWidth: 1, // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
    rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
    margins: [10, 10], // the pixel distance between each widget
    outerMargin: true, // whether margins apply to outer edges of the grid
    sparse: false, // "true" can increase performance of dragging and resizing for big grid (e.g. 20x50)
    isMobile: false, // stacks the grid items if true
    mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
    mobileModeEnabled: false, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
    minColumns: 1, // the minimum columns the grid must have
    minRows: 1, // the minimum height of the grid, in rows
    maxRows: 100,
    defaultSizeX: 1, // the default width of a gridster item, if not specifed
    defaultSizeY: 1, // the default height of a gridster item, if not specified
    minSizeX: 1, // minimum column width of an item
    maxSizeX: null, // maximum column width of an item
    minSizeY: 1, // minumum row height of an item
    maxSizeY: null, // maximum row height of an item
    resizable: {
      enabled: false,
      handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
      start: function(event, $element, widget) {}, // optional callback fired when resize is started,
      resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
      stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
    },
    draggable: {
      enabled: true, // whether dragging items is supported
      handle: '.my-class', // optional selector for drag handle
      start: function(event, $element, widget) {}, // optional callback fired when drag is started,
      drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
      stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
    }
  };
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

