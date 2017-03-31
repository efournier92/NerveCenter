(function() { 

  angular
    .module('nerveCenter')
    .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $http, $location, $uibModal, $log, $document, meanData, auth) {
    var $dash = this;

    $dash.widgets = {};
    $scope.$watch('widgets', function(widgets){
      console.log("changed");
    }, true);
      
    $scope.allIcons = allIcons;
    $scope.gridsterModalOptions = gridsterModalOptions;

    $scope.selectedIcon = "img/_blank.png";
    $scope.selectIcon = function(iconUrl) {
      $scope.selectedIcon = iconUrl;
    }

    function updateWidgets() {
      meanData.getProfile()
        .success(function(data) {
          $dash.widgets = data.widgets;
        })
        .error(function(e) {
          console.log(e);
        })
        .finally(function() {
          $scope.widgets = angular.fromJson($dash.widgets);
          $scope.gridOptions = gridOptions;
        });
    }

    updateWidgets();

    $scope.createWidget = function(){
      widgetUrl = $scope.widgetUrl;
      widgetRow = $scope.widgetRow;
      widgetCol = $scope.widgetCol;
      widgetIcon = $scope.selectedIcon;
      if (!widgetUrl || !widgetRow || !widgetCol) {
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
      console.log($scope.widgets);
    }
    $scope.saveWidgets = function() {
      data = "{}";

      meanData.updateWidgets()
        .success(function(data) {
          $dash.widgets = data.widgets;
        })
        .error(function(e) {
          console.log(e);
        })
        .finally(function() {
          // $scope.widgets = angular.fromJson($dash.widgets);
          // $scope.gridOptions = gridOptions;
        });
    }

    $scope.update = function() {
      id = auth.currentUser().id;
      console.log(id);
      $http.put('/api/user/' + $scope.contact._id, $scope.contact)
        .success(function(response) {
          refresh();
        })
    };

    $dash.open = function(size, parentSelector) {
      var parentElem = parentSelector ? 
        angular.element($document[0].querySelector('.modal-demo')) : undefined;
      var modalInstance = $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'mainModal.html',
        controller: 'utilityModalCtrl',
        controllerAs: '$dash',
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
      $dash.open();
    };
  };

})();

