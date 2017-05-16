(function () {

  angular
    .module('nerveCenter')
    .directive('linkWidget', linkWidget);

  function linkWidget() {
    return {
      templateUrl: '/dashboard/widgetTemplates/link-widget.template.html';
    }
  };
});

