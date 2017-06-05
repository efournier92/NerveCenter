(function () {

  angular
    .module('nerveCenter')
    .directive('ncCalc', ncCalc);

  function ncCalc() {
    return {
      restrict: 'AEC',
      controller: 'ncCalcCtrl',
      templateUrl: '/dashboard/nc-calc/nc-calc.template.html'
    }
  }
})();

