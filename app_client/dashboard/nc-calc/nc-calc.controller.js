(function () {

  angular
    .module('nerveCenter')
    .directive('ncCalc', ncCalc);

  function ncCalc() {
    return {
      restrict: 'E',
      controller: 'ngCalcCtrl',
      templateUrl: '/dashboard/nc-calc/nc-calc.template.html'
      }
    }
})();

