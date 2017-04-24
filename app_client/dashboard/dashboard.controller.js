(function() { 

  angular
    .module('nerveCenter')
    .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $http, $location, 
    $uibModal, $log, $document, $filter, meanData, auth) {

    $scope.draggable = false;
    $scope.deleteEnabled = false;

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

    function updateWidgets() {
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

    $scope.toggleDelete = function() {
      $scope.deleteEnabled = !$scope.deleteEnabled;
    }

    $scope.deleteWidget = function(widget) {
      $scope.widgets = $scope.widgets.filter(function(element){
        return element.url != widget.url;
      });

      $scope.saveWidgets();
    }

    $scope.onLogout = function() {
      auth.logout();
      $location.path('dashboard.view');
    }

    $scope.toggleDraggable = function() {
      if ($scope.gridOptions.draggable.enabled == false) {
        $scope.draggable = true;
        $scope.gridOptions.draggable.enabled = true;
      } else {
        $scope.draggable = false;
        $scope.gridOptions.draggable.enabled = false;
        $scope.saveWidgets();
      }
    }

    $scope.allIcons = allIcons;
    $scope.gridsterModalOptions = gridsterModalOptions;
    $scope.selectedIcon = "img/_blank.png";

    $scope.selectIcon = function(iconUrl) {
      $scope.selectedIcon = iconUrl;
    }

    $scope.openMainModal = function(size, parentSelector) {
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

