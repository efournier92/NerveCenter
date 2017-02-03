(function() {

  angular
    .module('nerveCenter')
    .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $location, $uibModal, $log, $document, meanData) {

      (function() {
        meanData.getProfile()
        .success(function(data) {
          $scope.widgets = data.widgets;
        })
        .error(function (e) {
          console.log(e);
        });
      });

    var $dash = this;
    $dash.items = ['item1', 'item2', 'item3'];

    $dash.open = function (size, parentSelector) {
      var parentElem = parentSelector ? 
        angular.element($document[0].querySelector('.modal-demo')) : undefined;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: 'utilityModalCtrl',
        controllerAs: '$dash',
        size: size,
        appendTo: parentElem,
        resolve: {
          items: function () {
            return $dash.items;
          }
        }
      });
    };

    $dash.onLongPress = function () {
      $dash.open();
    };

    newObj = angular.fromJson(vm.widgets);
    console.log($scope.widgets);

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

    var s = JSON.stringify($scope.widgets);
    var vm = this;

    vm.credentials = {
      name : "",
      email : "",
      widgets : "",
      password : ""
    };
  };

})();
