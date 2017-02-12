(function() {

  angular
    .module('nerveCenter')
    .controller('utilityModalCtrl', utilityModalCtrl);
  
  function utilityModalCtrl($uibModalInstance, items) {
    var $dash = this;

    $dash.ok = function () {
      $uibModalInstance.close($dash.selected.item);
    };

    $dash.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  };

})();
