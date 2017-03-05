(function() {

  angular
    .module('nerveCenter')
    .component('modalComponent', {
      templateUrl: 'myModalContent.html',
      bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
      },

      controller: function () {
        var $dash = this;

        $dash.$onInit = function () {
          $dash.items = $dash.resolve.items;
          $dash.selected = {
            item: $dash.items[0]
          };
        };

        $dash.ok = function () {
          $dash.close({$value: $dash.selected.item});
        };

        $dash.cancel = function () {
          $dash.dismiss({$value: 'cancel'});
        };
      }
    });

})();

