(function () {

  angular
    .module('nerveCenter')
    .controller('navigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location', 'auth'];
  function navigationCtrl($location, auth) {
    var vm = this;
    vm.isLoggedIn = auth.isLoggedIn();
    vm.currentUser = auth.currentUser();
  }

})();
