(function() { 
  angular
    .module('nerveCenter')
    .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $http, $location, $uibModal, $log, $document, meanData, authentication) {
    var $dash = this;

    $dash.widgets = {};
    console.log("Token", authentication.currentUser());
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
    // id = authentication.currentUser().id;
    // $scope.saveWidget(id);
        });
    }

    updateWidgets();

    $scope.saveWidgets = function() {
      data = "{}";

      meanData.updateWidgets()
        .success(function(data) {
          $dash.widgets = data.widgets;
        })
        .error(function (e) {
          console.log(e);
        })
        .finally(function() {
          // $scope.widgets = angular.fromJson($dash.widgets);
          // $scope.gridOptions = gridOptions;
        });
    }

    $scope.saveWidget = function(id) {
      // var newWidget = {
      //   url: $scope.widgetUrl, 
      //   icon: $scope.widgetIcon,
      //   row: $scope.widgetRow,
      //   col: $scope.widgetCol,
      //   sizeX: 1,
      //   sizeY: 1
      // }
      // $scope.widgets.push(newWidget);
      console.log(id);
      data = "{}";
      $http.put('api/profile/' + id, data)
        .success(function(response) {
          console.log("RES",response);
        })
        .error(function (data, status, header, config) {
          console.log("Put Error", data)
        });
    };

    $scope.update = function() {
      id = authentication.currentUser().id;
      console.log(id);
      $http.put('/api/profile/' + $scope.contact._id, $scope.contact).success(function(response) {
        refresh();

      })
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
