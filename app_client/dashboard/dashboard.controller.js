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
    

      
    $scope.selectedIcon = "img/Drive.png";
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
    $scope.allIcons = allIcons;
    console.log($scope.allIcons);
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
        templateUrl: 'myModalContent.html',
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

