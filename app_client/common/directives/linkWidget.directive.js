(function () {

  angular
    .module('nerveCenter')
    .directive('renderWidget', renderWidget);

  function renderWidget() {
    return {
      restrict: 'AEC',
      templateUrl: function (elem, attrs) {
        return "/dashboard/widgetTemplates/" + attrs.type +".template.html";
      }
    }
  };
})();
