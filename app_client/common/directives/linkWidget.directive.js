(function () {

  angular
    .module('nerveCenter')
    .directive('linkWidget', linkWidget);

  function linkWidget() {
    return {
      templateUrl: function (elem, attrs) {
        console.log(attrs);
       return "/dashboard/widgetTemplates/" + "link-widget" +".template.html";

      }
    }
  };
})();

