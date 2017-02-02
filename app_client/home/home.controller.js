(function() {

  angular
    .module('meanApp')
    .controller('homeCtrl', homeCtrl);

  function homeCtrl($scope) {
    console.log('Home controller is running');
    console.log('Burden of proof.');
      // $scope.onLongPress = function () {
      //   console.log("Long press");
      // };
      $scope.widgets = [
        { sizeX: 1,
          sizeY: 1,
          row: 0,
          col: 0,
          url: "https://www.google.com/",
          icon: "img/Google.png" },
          { sizeX: 1,
            sizeY: 1,
            row: 0,
            col: 1,
            url: "http://en.wikipedia.org/wiki/Main_Page",
            icon: "img/Wiki.png" },
            { sizeX: 1,
              sizeY: 1,
              row: 0,
              col: 2,
              url: "http://cake.whatbox.ca:57094/",
              icon: "img/RTorrent.png" },
              { sizeX: 1,
                sizeY: 1,
                row: 0,
                col: 3,
                url: "https://github.com/",
                icon: "img/GitHub.png" },
                { sizeX: 1,
                  sizeY: 1,
                  row: 0,
                  col: 4,
                  url: "https://twitter.com",
                  icon: "img/Twitter.png" },
                  { sizeX: 1,
                    sizeY: 1,
                    row: 1,
                    col: 0,
                    url: "https://www.google.com/imghp?hl=en&tab=wi&ei=KA6OU4CWBtDisATKzoKwBA&ved=0CAQQqi4oAg",
                    icon: "img/Image.png" },
                    { sizeX: 1,
                      sizeY: 1,
                      row: 1,
                      col: 1,
                      url: "https://getpocket.com/a/queue/list/",
                      icon: "img/ReadLater.png" },
                      { sizeX: 1,
                        sizeY: 1,
                        row: 1,
                        col: 2,
                        url: "http://www.youtube.com/",
                        icon: "img/Tube.png" },
                        { sizeX: 1,
                          sizeY: 1,
                          row: 1,
                          col: 3,
                          url: "https://app.simplenote.com/",
                          icon: "img/Notes.png" },
                          { sizeX: 1,
                            sizeY: 1,
                            row: 1,
                            col: 4,
                            url: "https://www.linkedin.com",
                            icon: "img/Linked.png" },
                            { sizeX: 1,
                              sizeY: 1,
                              row: 1,
                              col: 5,
                              url: "http://www.cnn.com/",
                              icon: "img/CNN.png" },
      ];

      // for (i = 0; i < 4; i++) {
      //   for (j = 0; j < 5; j++) {
      //     $scope.widgets.push(newWidget);
      //   }
      // }

      $scope.gridOptions = {
        columns: 5,
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
        mobileModeEnabled: true,
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
    }
  })();
