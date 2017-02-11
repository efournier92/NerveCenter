(function() { 
  angular
    .module('nerveCenter')
    .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $http, $location, $uibModal, $log, $document, meanData) {
    var $dash = this;

    $dash.widgets = {};

    $scope.$watch('widgets', function(widgets){
      console.log("changed");
    }, true);

    function updateWidgets() {
      meanData.getProfile()
        .success(function(data) {
          $dash.widgets = data.widgets;
        })
        .error(function (e) {
          console.log(e);
        })
        .finally(function() {
          $scope.widgets = angular.fromJson($dash.widgets);
          $scope.gridOptions = gridOptions;
          console.log($scope.widgets);
        });
    }

    updateWidgets();

    $scope.saveWidget = function() {
      var newWidget = {
        url: $scope.widgetUrl, 
        icon: $scope.widgetIcon,
        row: $scope.widgetRow,
        col: $scope.widgetCol,
        sizeX: 1,
        sizeY: 1
      }
      $scope.widgets.push(newWidget);
      data = angular.toJson($scope.widgets);
      $http.put('/api/profile')
        .success(function (data, status, headers) {
          $scope.ServerResponse = data;
        })
        .error(function (data, status, header, config) {
          console.log("Put Error")
        });
      console.log($scope.widgets);
    };

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
  };
})();
