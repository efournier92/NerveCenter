(function () {

  angular
    .module('nerveCenter')
    .directive('selectText', selectText);

  function selectText($window) {
    return {
      link: function(scope, element) {
        element.on('click', function () {
          var selection = $window.getSelection();        
          var range = document.createRange();
          range.selectNodeContents(element[0]);
          selection.removeAllRanges();
          selection.addRange(range);
        });
      }
    }
  }

})();

