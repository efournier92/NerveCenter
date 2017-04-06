(function() { 

  angular
    .module('nerveCenter')
    .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $http, $location, $uibModal, $log, $document, $filter, meanData, auth) {
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
          $scope.openLoginModal();
        })
        .finally(function() {
          $scope.widgets = angular.fromJson($dash.widgets);
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
        })
        .finally(function() {
          // $scope.widgets = angular.fromJson($dash.widgets);
          // $scope.gridOptions = gridOptions;
        });
    }

    updateWidgets();

    $scope.createWidget = function() {
      var widgetUrl = $scope.widgetUrl;
      var widgetRow = $scope.widgetRow;
      var widgetCol = $scope.widgetCol;
      var widgetIcon = $scope.selectedIcon;
      if (!widgetUrl || !widgetRow || !widgetCol) {
        //TODO: handle exception in UI
        console.log("ERROR");
        return;
      }

      var newWidget = {
        col: widgetCol,
        icon: widgetIcon,
        row: widgetRow,
        sizeX: 1,
        sizeY: 1,
        url: widgetUrl 
      }

      $scope.widgets.push(newWidget);
      $scope.saveWidgets();
    }

    $scope.deleteWidget = function(widget) {
      $uibModalInstance.dismiss('cancel');
      // $scope.deleteEnabled = true; 
      var index = $scope.widgets.indexOf(widget);
      $scope.widgets.splice(index, 1);
      $scope.saveWidgets();
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
      var parentElem = parentSelector ? 
        angular.element($document[0].querySelector('.modal-demo')) : undefined;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'mainModal.html',
        controller: 'mainModalCtrl',
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

    $scope.openLoginModal = function(size, parentSelector) {
      var parentElem = parentSelector ? 
        angular.element($document[0].querySelector('.modal-demo')) : undefined;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'loginModal.html',
        controller: 'loginCtrl',
        controllerAs: '$reg',
        size: size,
        appendTo: parentElem,
        resolve: {
          items: function() {
            return $dash.items;
          }
        }
      });
    };

    $dash.onLongPress = function() {
      $scope.openMainModal();
    };
  };

})();

