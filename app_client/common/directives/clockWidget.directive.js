(function () {

  angular
    .module('nerveCenter')
    .directive('clockWidget', clockWidget);

  function clockWidget() {
    return {
      restrict: 'AEC',
      templateUrl: function (elem, attrs) {
        return "/dashboard/widgetTemplates/clock-widget.template.html";
      }
    }
  };
})();

