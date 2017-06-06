(function () {

  angular
    .module('nerveCenter')
    .directive('nc-calc', ncCalc);

  function ncCalc() {
    return {
      restrict: 'E',
      controller: 'ncCalcCtrl',
      templateUrl: '/dashboard/nc-calc/nc-calc.template.html'
      }
    }
})();

