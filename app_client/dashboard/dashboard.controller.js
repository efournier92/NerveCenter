(function () {

  angular
  .module('nerveCenter')
  .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $http, $location,
    $uibModal, $log, $document, $filter, $window, apiData, auth) {

      var $dshBrd = this;

      $scope.draggable = false;
      $scope.deleteEnabled = false;
      $scope.urlsEnabled = true;
      $scope.areIconsLoaded = false;
      $scope.deleteIcon = 'img/_x.png';
      $scope.lockIcon = 'img/_locked.png';

      updateWidgets();

      function instantiateGridster() {
        var width = this.window.outerWidth;
        var adjustedGridOptions = gridOptions;
        if (width > 500) {
          adjustedGridOptions.columns = 7;
        } else {
          adjustedGridOptions.columns = 3;
        }
        return adjustedGridOptions;
      }

      function checkScreenSize() {
        var start = $window.outerWidth;
        if (start > 500) {
          $dshBrd.screenSize = 'lg';
        } else {
          $dshBrd.screenSize = 'sm';
        }
      }

      function updateToolIconSize() {
        $scope.toolIconSize =
        $dshBrd.screenSize == 'sm'
        ? $scope.toolIconSize = 28 + 'px'
        : $scope.toolIconSize = 20 + 'px';
      }

      updateToolIconSize();

      function updateWidgets() {
        checkScreenSize();
        $dshBrd.lastScreenSize = inputScreenSize($window.outerWidth);
        apiData.getProfile()
        .success(function (user) {
          $dshBrd.widgetsLg = angular.fromJson(user.widgetsLg);
          $dshBrd.widgetsSm = angular.fromJson(user.widgetsSm);
        })
        .error(function () {
          $scope.openAuthModal();
        })
        .finally(function () {
          $scope.widgets =
          $dshBrd.screenSize == 'lg'
          ? $dshBrd.widgetsLg
          : $dshBrd.widgetsSm;

          $scope.gridOptions = instantiateGridster();
          $dshBrd.currentWidth = $window.outerWidth;

          getIcons();
        });
      }

      $dshBrd.saveWidgets = function () {
        checkScreenSize();

        if ($dshBrd.screenSize == 'lg') {
          $dshBrd.widgetsLg = $scope.widgets;
        } else {
          $dshBrd.widgetsSm = $scope.widgets;
        }

        data = [
          $dshBrd.widgetsLg,
          $dshBrd.widgetsSm
        ];

        apiData.updateWidgets(data)
        .success(function (data) {
          console.log('Successfully updated widgets')
        })
        .error(function (e) {
          console.log(e);
        });
      }

      $scope.createWidget = function () {
        var widgetUrl = $scope.widgetUrl;
        var widgetWeight = $scope.widgetWeight;
        var widgetIcon = $scope.selectedIcon;

        var defaultIcon = "img/_blank.png";
        // Form validation
        if (!widgetUrl && widgetIcon === defaultIcon) {
          window.alert("Please Enter URL and Select an Icon");
          return;
        } else if (!widgetUrl) {
          window.alert("Please Enter URL");
          return;
        } else if (widgetIcon === defaultIcon) {
          window.alert("Please Select an Icon");
          return;
        }

        function pushNewWidget(size) {
          if (size === 'lg') {
            var len = $dshBrd.widgetsLg.length;
            var columns = 7;
            var newWidget = createNewWidget(len, columns);
            $dshBrd.widgetsLg.push(newWidget);
          } else if (size === 'sm') {
            var len = $dshBrd.widgetsSm.length;
            var columns = 3;
            var newWidget = createNewWidget(len, columns);
            $dshBrd.widgetsSm.push(newWidget);
          }
        }

        function createNewWidget(len, columns) {
          var newWidget = {
            type: 'link-widget',
            sizeX: 1,
            sizeY: 1,
            icon: widgetIcon,
            url: widgetUrl,
            row: Math.floor(len / columns),
            col: (len % columns) + 1
          }
          return newWidget;
        }

        pushNewWidget('lg');
        pushNewWidget('sm');

        $dshBrd.saveWidgets();
        $location.path('dashboard.view');
      }

      $scope.importWidgets = function () {
        var widgetString = angular.fromJson($scope.widgetString);
        $scope.widgets = widgetString;

        checkScreenSize();
        if ($dshBrd.screenSize == 'lg') {
          $dshBrd.widgetsLg = widgetString;
        } else {
          $dshBrd.widgetsSm = widgetString;
        }

        $dshBrd.saveWidgets();
        $location.path('dashboard.view');
      }

      $scope.deleteWidget = function (widget) {
        $scope.widgets = $scope.widgets.filter(function (element){
          return element.url != widget.url;
        });

        $dshBrd.saveWidgets();
      }

      $scope.toggleDraggable = function () {
        gridOptions.draggable.enabled = !gridOptions.draggable.enabled;
        $scope.urlsEnabled = !$scope.urlsEnabled;

        if ($scope.deleteEnabled) {
          $scope.deleteEnabled = false;
          $scope.deleteIcon = 'img/_x.png';
        }

        if (gridOptions.draggable.enabled) {
          $scope.lockIcon = 'img/_lockedRed.png';
        } else {
          $scope.lockIcon = 'img/_locked.png';
        }

        if (!gridOptions.draggable.enabled)
        $dshBrd.saveWidgets();
      }

      $scope.toggleDelete = function () {
        $scope.deleteEnabled = !$scope.deleteEnabled;
        $scope.urlsEnabled = !$scope.urlsEnabled;

        if ($scope.deleteEnabled) {
          $scope.deleteIcon = 'img/_xRed.png';
        } else {
          $scope.deleteIcon = 'img/_x.png';
        }

        if (gridOptions.draggable.enabled) {
          gridOptions.draggable.enabled = false;
          $scope.lockIcon = 'img/_locked.png';
        }
      }

      function getIcons() {
        apiData.getIcons()
        .success(function (icons) {
          $dshBrd.icons = icons;
        })
        .finally(function () {
          $dshBrd.allIcons = [];
          var len = $dshBrd.icons.length;

          for (i = 0; i < len; i++) {
            var iconObj = {};
            var iconString = 'img/ico/' + $dshBrd.icons[i];
            iconObj.path = iconString;
            $dshBrd.allIcons.push(iconObj);
          }
          $scope.shownIcons = [];
          $scope.loadSomeIcons();
        });
      }

      $scope.loadAllIcons = function () {
        var allIcons = [];
        var totalIcons = $dshBrd.allIcons.length - 1;
        $scope.areIconsLoaded = true;

        for (var i = 0; i <= totalIcons; i++) {
          var newIco = $dshBrd.allIcons[i]
          allIcons.push(newIco);
        }
        $scope.shownIcons = allIcons;
      }

      $scope.loadSomeIcons = function () {
        for (var i = 0; i <= 24; i++) {
          var newIco = $dshBrd.allIcons[i]
          $scope.shownIcons.push(newIco);
        }
      }

      $scope.gridsterModalOptions = gridsterModalOptions;
      $scope.selectedIcon = "img/_blank.png";

      $scope.selectIcon = function (iconPath) {
        $scope.selectedIcon = iconPath;
      }

      $scope.openMainModal = function (size, parentSelector) {
        gridOptions.draggable.enabled = false;
        $scope.deleteEnabled = false;

        var parentElem = parentSelector ?
        angular.element($document[0].querySelector('.modal-demo')) : undefined;

        var modalInstance = $uibModal.open({
          templateUrl: 'mainModal.html',
          controller: 'dashboardCtrl',
          size: 'lg',
          appendTo: parentElem
        });
      };

      $scope.openAuthModal = function (size, parentSelector) {
        var parentElem = parentSelector ?
        angular.element($document[0].querySelector('.main-modal')) : undefined;

        var modalInstance = $uibModal.open({
          templateUrl: 'authModal.html',
          controller: 'authCtrl',
          controllerAs: '$auth',
          appendTo: parentElem,
        });
      };

      $scope.onLogout = function () {
        auth.logout();
        $location.path('dashboard.view');
      }

      $scope.syncWidgets = function () {
        $dshBrd.widgetsLg = $scope.widgets;
        $dshBrd.widgetsSm = $scope.widgets;
        $dshBrd.saveWidgets();
        $location.path('dashboard.view');
      }

      $scope.resetWidgets = function () {
        checkScreenSize();

        apiData.getDefaultGrid()
        .success(function (defaultGrid) {
          defaultGrid = angular.fromJson(defaultGrid);
          $scope.widgets = defaultGrid;
          if ($dshBrd.screenSize == 'lg') {
            $dshBrd.widgetsLg = defaultGrid;
          } else {
            $dshBrd.widgetsSm = defaultGrid;
          }
        })
        .error(function (e) {
          console.log(e);
        })
        .finally(function () {
          $dshBrd.saveWidgets();
          $location.path('dashboard.view');
        });
      }

      $scope.clearGrid = function () {
        $scope.widgets = [];
        if ($dshBrd.screenSize == 'lg') {
          $dshBrd.widgetsLg = [];
        } else {
          $dshBrd.widgetsSm = [];
        }
        $dshBrd.saveWidgets();
        $location.path('dashboard.view');
      }

      var resizeBreaks = {
        'sm' : 500
      };

      function inputScreenSize(width) {
        if (width > 500) {
          return 'lg';
        } else {
          return 'sm';
        }
      }

      angular.element($window).bind('resize', function () {
        var oldWidth = $dshBrd.currentWidth;
        var oldSize = $dshBrd.lastScreenSize;
        var newWidth = $window.outerWidth;
        var newSize = inputScreenSize(newWidth);

        if (oldSize !== newSize) {
          $location.path('dashboard.view');
        }

        $dshBrd.lastScreenSize = newSize;
      });
    };
  })();
