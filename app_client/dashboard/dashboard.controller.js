(function() { 

  angular
    .module('nerveCenter')
    .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $http, $location, 
    $uibModal, $log, $document, $filter, meanData, auth) {

    var $dash = this;

    $scope.deleteEnabled = false;

    $dash.widgets = {};
    $scope.$watch('widgets', function(widgets){
      console.log("changed:", $scope.widgets);
    }, true);

    $scope.allIcons = allIcons;
    $scope.gridsterModalOptions = gridsterModalOptions;

    $scope.selectedIcon = "img/_blank.png";
    $scope.selectIcon = function(iconUrl) {
      $scope.selectedIcon = iconUrl;
    }

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
          $dash.widgets = data.widgets;
        })
        .error(function() {
          $scope.openAuthModal();
        })
        .finally(function() {
          $scope.widgets = angular.fromJson($dash.widgets);
          $scope.gridOptions = instantiateGridster();
        });
    }

    $scope.importWidgets = function() {
      $scope.widgets = angular.fromJson($scope.widgetString);
      $scope.saveWidgets();
      location.reload();
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

    $scope.widgetString = angular.toJson($scope.widgets);

    $scope.toggleDraggable = function() {
      if ($scope.gridOptions.draggable.enabled == false) {
        $scope.draggable = true;
        $scope.gridOptions.draggable.enabled = true;
      } else {
        $scope.draggable = false;
        $scope.gridOptions.draggable.enabled = false;
        $scope.saveWidgets();
      }
      console.log($scope.widgets);
    }

    $scope.createWidget = function() {
      var widgetUrl = $scope.widgetUrl;
      var widgetWeight = $scope.widgetWeight;
      var widgetIcon = $scope.selectedIcon;

      // Handle null fields
      if (!widgetUrl && !widgetIcon) {
        window.alert("Please Enter URL and Select an Icon");
        return;
      } else if (!widgetUrl) {
        window.alert("Please Enter URL");
        return;
      } else if (!widgetIcon) {
        window.alert("Please Select an Icon");
        return;
      }
    }

    var newWidget = {
      icon: widgetIcon,
      url: widgetUrl 
    }

    $scope.widgets.push(newWidget);
    $scope.saveWidgets();
  }

  $scope.deleteWidget = function(widget) {
    $scope.widgets = $scope.widgets.filter(function(element){
      return element.url != widget.url;
    });
    $scope.saveWidgets();
  }

  $scope.toggleDelete = function() {
    if ($scope.deleteEnabled == false) {
      $scope.deleteEnabled = true;
    } else {
      $scope.deleteEnabled = false;
    }
  }

  $scope.update = function() {
    id = auth.currentUser().id;
    console.log(id);
    $http.put('/api/user/' + $scope.contact._id, $scope.contact)
      .success(function(response) {
        refresh();
      })
  };

  $scope.closeModal = function() {
    $dash.dismiss('cancel');
  };

  $scope.openMainModal = function(size, parentSelector) {
    size = 'lg';
    var parentElem = parentSelector ? 
      angular.element($document[0].querySelector('.modal-demo')) : undefined;
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'mainModal.html',
      controller: 'dashboardCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        items: function() {
          return $dash.items;
        }
      }
    });
  };

  $scope.openAuthModal = function(size, parentSelector) {
    var parentElem = parentSelector ? 
      angular.element($document[0].querySelector('.modal-demo')) : undefined;
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'authModal.html',
      controller: 'authCtrl',
      controllerAs: '$auth',
      size: size,
      appendTo: parentElem,
      resolve: {
        items: function() {
          return $dash.items;
        }
      }
    });
  };

  $scope.logIt = function(obj) {
    console.log(obj); 
  };

  $scope.onLogout = function() {
    auth.logout();
    $location.path('dashboard.view');
  }
};

$scope.draggable = false;
updateWidgets();
})();

