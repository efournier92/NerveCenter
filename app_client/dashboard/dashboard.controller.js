(function() { 

  angular
    .module('nerveCenter')
    .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $http, $location, 
    $uibModal, $log, $document, $filter, $window, meanData, auth) {

    $scope.draggable = false;
    $scope.deleteEnabled = false;
    $scope.urlsEnabled = true;

    updateWidgets();

    function instantiateGridster() {
      var width = this.window.innerWidth;
      var adjustedGridOptions = gridOptions;
      if (width > 1000) {
        adjustedGridOptions.columns = 7; 
      } else if (width > 500) {
        adjustedGridOptions.columns = 6; 
      } else {
        adjustedGridOptions.columns =3;
      }
      return adjustedGridOptions;
    }

    function checkScreenSize() {
      var start = $window.innerWidth;
      if (start > 1000) {
        $scope.screenSize = 'lg';
      } else if (start > 500) {
        $scope.screenSize = 'md';
      } else {
        $scope.screenSize = 'sm';
      }
      console.log($scope.screenSize);
    }

    function updateWidgets() {
      checkScreenSize();
      meanData.getProfile()
        .success(function(user) {
          $scope.widgetsLg = angular.fromJson(user.widgetsLg);
          $scope.widgetsMd = angular.fromJson(user.widgetsMd);
          $scope.widgetsSm = angular.fromJson(user.widgetsSm);
        })
        .error(function() {
          $scope.openAuthModal();
        })
        .finally(function() {
          if ($scope.screenSize == 'lg') {
            $scope.widgets = $scope.widgetsLg;
          } else if ($scope.screenSize == 'md') {
            $scope.widgets = $scope.widgetsMd;
          } else {
            $scope.widgets = $scope.widgetsSm;
          }
          $scope.gridOptions = instantiateGridster();
        });
    }

    $scope.saveWidgets = function(action) {
      checkScreenSize();

      if ($scope.screenSize == 'lg') {
        $scope.widgetsLg = $scope.widgets;
      } else if ($scope.screenSize == 'md') {
        $scope.widgetsMd = $scope.widgets;
      } else {
        $scope.widgetsSm = $scope.widgets;
      }

      data = [
        $scope.widgetsLg, 
        $scope.widgetsMd, 
        $scope.widgetsSm, 
        { size: $scope.screenSize }
      ];

      meanData.updateWidgets(data)
        .success(function(data) {
          console.log("Success!: ", data)
        })
        .error(function(e) {
          console.log(e);
        });
    }

    $scope.createWidget = function() {
      var widgetUrl = $scope.widgetUrl;
      var widgetWeight = $scope.widgetWeight;
      var widgetIcon = $scope.selectedIcon;

      var defaultIcon = "img/_blank.png";
      // Handle null values 
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

      var newWidget = {
        icon: widgetIcon,
        url: widgetUrl
      }

      $scope.widgetsLg.push(newWidget);
      $scope.widgetsMd.push(newWidget);
      $scope.widgetsSm.push(newWidget);
      $scope.saveWidgets('create');
      $location.path('dashboard.view');
    }

    $scope.syncWidgets = function() {
      $scope.widgetsLg = $scope.widgets;
      $scope.widgetsMd = $scope.widgets;
      $scope.widgetsSm = $scope.widgets;
      $scope.saveWidgets();
      location.reload();
    }

    $scope.importWidgets = function() {
      $scope.widgets = angular.fromJson($scope.widgetString);
      $scope.saveWidgets();
      location.reload();
    } 

    $scope.deleteWidget = function(widget) {
      $scope.widgets = $scope.widgets.filter(function(element){
        return element.url != widget.url;
      });

      $scope.saveWidgets();
    }

    $scope.onLogout = function() {
      auth.logout();
      location.reload();
    }

    $scope.toggleDraggable = function() {
      gridOptions.draggable.enabled = !gridOptions.draggable.enabled;
      $scope.urlsEnabled = !$scope.urlsEnabled;
      if ($scope.deleteEnabled)
        $scope.deleteEnabled = false;
      if (!gridOptions.draggable.enabled)
        $scope.saveWidgets();
    }

    $scope.toggleDelete = function() {
      $scope.deleteEnabled = !$scope.deleteEnabled;
      $scope.urlsEnabled = !$scope.urlsEnabled;
      if (gridOptions.draggable.enabled)
        gridOptions.draggable.enabled = false;
    }

    $scope.allIcons = allIcons;
    $scope.gridsterModalOptions = gridsterModalOptions;
    $scope.selectedIcon = "img/_blank.png";

    $scope.selectIcon = function(iconUrl) {
      $scope.selectedIcon = iconUrl;
    }

    $scope.openMainModal = function(size, parentSelector) {
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

    $scope.openAuthModal = function(size, parentSelector) {
      var parentElem = parentSelector ? 
        angular.element($document[0].querySelector('.modal-demo')) : undefined;

      var modalInstance = $uibModal.open({
        templateUrl: 'authModal.html',
        controller: 'authCtrl',
        controllerAs: '$auth',
        appendTo: parentElem,
      });
    };

    angular.element($window).bind('resize', function() {
      if (($scope.screenSize == 'lg' && $window.innerWidth < 1000)
        || ($scope.screenSize = 'md' && $window.innerWidth > 1000)
        || ($scope.screenSize = 'md' && $window.innerWidth < 500)
        || ($scope.screenSize = 'sm' && $window.innerWidth > 500)) {
        location.reload();
      }
    });
  };

})();

