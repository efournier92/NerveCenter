(function() {

  angular
    .module('nerveCenter')
    .controller('widgetsCtrl', widgetsCtrl);

  widgetsCtrl.$inject = ['$location', 'meanData'];
  function widgetsCtrl($location, meanData) {
    var vm = this;

    vm.user = {};

    meanData.getProfile()
      .success(function(data) {
        vm.user.widgets = data;
      })
      .error(function(e) {
        console.log(e);
      });
  }

})();
