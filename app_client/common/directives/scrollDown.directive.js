(function() {

  angular
    .module('nerveCenter')
    .directive('scrolly', scrolly);

  function scrolly($window) {
    return {
      restrict: 'AEC',
      link: function (scope, element, attrs) {
        var raw = element[0];
        console.log('loading directive');

        element.bind('scroll', function () {
          console.log('in scroll');
          console.log(raw.scrollTop + raw.offsetHeight);
          console.log(raw.scrollHeight);
          if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
            scope.$apply(attrs.scrolly);
          }
        });
      }
      // return {
      //   restrict: 'A',
      //   link: function(scope, element, attrs) {
      //     var raw = element[0];

      //     element.bind('scroll', function() {
      //       // var yPosition = raw.scrollTop + raw.offsetHeight;
      //       // if (yPosition > scope.lastYPosition) {
      //         console.log('in scroll');
      //         console.log(raw.scrollTop + raw.offsetHeight);
      //         console.log(raw.scrollHeight);
      //       // }
      //       scope.lastYPosition = yPosition;
      //     });
      //   }
      // };
    };
    };
  });

