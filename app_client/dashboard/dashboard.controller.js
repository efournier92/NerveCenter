(function() { 

  angular
    .module('nerveCenter')
    .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $http, $location, 
    $uibModal, $log, $document, $filter, $window, meanData, auth) {

    $scope.draggable = false;
    $scope.deleteEnabled = false;
    $scope.urlsEnabled = true;


    angular.element($window).bind('resize', function() {
      if (($scope.screenSize == 'lg' && $window.innerWidth < 1000)
        || ($scope.screenSize = 'md' && $window.innerWidth > 1000)
        || ($scope.screenSize = 'md' && $window.innerWidth < 500)
        || ($scope.screenSize = 'sm' && $window.innerWidth > 500)) {
        location.reload();
      }
    });

    updateWidgets();

    function instantiateGridster() {
      var width = this.window.innerWidth;
      var adjustedGridOptions = gridOptions;
      if (width > 1000) {
        adjustedGridOptions.columns = 7; 
      } else if (width > 500) {
        adjustedGridOptions.columns = 6; 
      } else {
        adjustedGridOptions.columns = 2; 
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
        .success(function(data) {
          this.widgets = data.widgets;
        })
        .error(function() {
          $scope.openAuthModal();
        })
        .finally(function() {
          $scope.widgets = angular.fromJson(this.widgets);
          $scope.gridOptions = instantiateGridster();
        });
    }

    $scope.saveWidgets = function() {
      data = $scope.widgets;
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

      $scope.widgets.push(newWidget);
      $scope.saveWidgets();
      $location.path('dashboard.view');
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

  };

})();

