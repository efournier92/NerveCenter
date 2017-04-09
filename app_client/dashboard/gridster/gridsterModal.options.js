var gridsterModalOptions = {
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

