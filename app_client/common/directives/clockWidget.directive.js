(function () {

  angular
    .module('nerveCenter')
    .directive('clockWidget', clockWidget);

  function clockWidget($window) {
    return {
      template: '<ds-widget-clock show-analog theme="dark"></ds-widget-clock>'

    }
  }

})();

