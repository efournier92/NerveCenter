(function () {

  angular
  .module('nerveCenter')
  .directive('scrolly', scrolly);

  function scrolly($window) {
    return {
      restrict: 'AEC',
      link: function (scope, element, attrs) {
        var raw = element[0];

        element.bind('scroll', function () {
          if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
            scope.$apply(attrs.scrolly);
          }
        });
      }
    };
  };
});
