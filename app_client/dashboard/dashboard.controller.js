(function() { 
  angular
    .module('nerveCenter')
    .controller('dashboardCtrl', dashboardCtrl);

  function dashboardCtrl($scope, $location, $uibModal, $log, $document, meanData) {
    var $dash = this;

    $dash.widgets = {};

    meanData.getProfile()
      .success(function(data) {
        $dash.widgets = data.widgets;
      })
      .error(function (e) {
        console.log(e);
      })
      .finally(function() {
        $scope.widgets = angular.fromJson($dash.widgets);
      });

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
