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
    $scope.lockIcon = 'img/_locked.png';
    $scope.deleteIcon = 'img/_x.png';

    updateWidgets();
    getIcons();

    function instantiateGridster() {
      var width = this.window.outerWidth;
      var adjustedGridOptions = gridOptions;
      if (width > 1000) {
        $scope.toolIconSize = 22;
        adjustedGridOptions.columns = 7;
      } else if (width < 500) {
        $scope.toolIconSize = 70;
        adjustedGridOptions.columns = 3;
      }
      return adjustedGridOptions;
    }

    function updateWidgets() {
      apiData.getProfile()
        .success(function (user) {
          $dshBrd.widgets = angular.fromJson(user.widgets);
        })
        .error(function () {
          $scope.openAuthModal();
        })
        .finally(function () {
          $scope.widgets = $dshBrd.widgets;
          $scope.gridOptions = instantiateGridster();
          $dshBrd.currentWidth = $window.outerWidth;
        });
    }

    $dshBrd.saveWidgets = function () {
      data = [
        $scope.widgets
      ];

      apiData.updateWidgets(data)
        .success(function (data) {
          console.log("Success!: ", data)
        })
        .error(function (e) {
          console.log(e);
        });
    }

    $scope.createWidget = function () {
      var widgetUrl = $scope.widgetUrl;
      var widgetWeight = $scope.widgetWeight;
      var widgetIcon = $scope.selectedIcon;
      console.log(widgetIcon);

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
        var len = $dshBrd.widgets.length;
        var newWidget = createNewWidget(len, columns);
        $dshBrd.widgets.push(newWidget);
      }

      function createNewWidget(len, columns) {
        var newWidget = {
          icon: widgetIcon,
          url: widgetUrl,
          row: Math.floor(len / columns),
          col: (len % columns) + 1 
        }
        return newWidget;
      }

      $dshBrd.saveWidgets();
      $location.path('dashboard.view');
    }


    $scope.importWidgets = function () {
      var widgetString = angular.fromJson($scope.widgetString);
      $scope.widgets = widgetString;
      $dshBrd.saveWidgets();
      $location.path('dashboard.view');
    } 

    $scope.deleteWidget = function (widget) {
      console.log("Delete: ", widget);
      $scope.widgets = $scope.widgets.filter(function (element){
        return element.url != widget.url;
      });

      $dshBrd.saveWidgets();
    }

    $scope.toggleDraggable = function () {
      gridOptions.draggable.enabled = !gridOptions.draggable.enabled;
      $scope.urlsEnabled = !$scope.urlsEnabled;
      $dshBrd.saveWidgets();
      $scope.draggable = !$scope.draggable;
      if (!$scope.draggable) {
        $scope.lockIcon = 'img/_locked.png';
      }
      if ($scope.draggable) {
        $scope.lockIcon = 'img/_lockedRed.png';
      }
    }

    $scope.toggleDelete = function () {
      $scope.deleteEnabled = !$scope.deleteEnabled;
      $scope.urlsEnabled = !$scope.urlsEnabled;
      if (!$scope.deleteEnabled) {
        $scope.deleteIcon = 'img/_x.png';
      }
      if ($scope.deleteEnabled) {
        $scope.deleteIcon = 'img/_xRed.png';
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
      var shownLen = $scope.shownIcons.length;
      var totalIcons = $dshBrd.allIcons.length;
      var iconsRemaining = totalIcons - shownLen - 1;
      $scope.areIconsLoaded = true;
      for (var i = shownLen; i <= iconsRemaining; i++) {
        var newIco = $dshBrd.allIcons[shownLen + i]
        $scope.shownIcons.push(newIco);
      }
    }

    $scope.loadSomeIcons = function () {
      var shownLen = $scope.shownIcons.length;
      for (var i = 1; i <= 24; i++) {
        var newIco = $dshBrd.allIcons[shownLen + i]
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

    $scope.resetWidgets = function () {
      apiData.getDefaultGrid()
        .success(function (defaultGrid) {
          defaultGrid = angular.fromJson(defaultGrid);
          $scope.widgets = defaultGrid;
        })
        .error(function (e) {
          console.log(e);
        })
        .finally(function () {
          $dshBrd.saveWidgets();
        });
    }

    var resizeBreaks = {
      'md' : 1000,
      'sm' : 500
    };

    angular.element($window).bind('resize', function () {
      var oldWidth = $dshBrd.currentWidth;
      var newWidth = $window.outerWidth;

      if ((oldWidth > resizeBreaks['md'] && newWidth < resizeBreaks['md'])
        || (oldWidth < resizeBreaks['md'] && newWidth > resizeBreaks['md'])
        || (oldWidth > resizeBreaks['sm'] && newWidth < resizeBreaks['sm'])
        || (oldWidth < resizeBreaks['sm'] && newWidth > resizeBreaks['sm'])) {

        updateWidgets();
      }
    });

  };
})();

