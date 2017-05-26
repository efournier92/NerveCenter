(function () {

  angular
    .module('nerveCenter')
    .directive('linkWidget', linkWidget);

  function linkWidget() {
    return {
      restrict: 'AEC',
      templateUrl: function (elem, attrs) {
        return "/dashboard/widgetTemplates/" + "link-widget" +".template.html";

      }
    }
  };
})();

