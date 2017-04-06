(function() {

  angular
    .module('nerveCenter')
    .controller('mainModalCtrl', mainModalCtrl);
  
  function mainModalCtrl($uibModalInstance, items) {
    var $ctrl = this;

    $ctrl.ok = function() {
      $uibModalInstance.close($dash.selected.item);
    };

    $ctrl.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };
  };

})();

