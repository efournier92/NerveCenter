(function () {

  angular
    .module('nerveCenter')
    .directive('ncCalc', ncCalc);

  function ncCalc() {
    return {
      restrict: 'AEC',
      templateUrl: function (elem, attrs) {
        return "/dashboard/nc-calc/nc-calc.template.html";
      }
    }
  };
})();

