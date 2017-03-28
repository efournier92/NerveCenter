(function() {

  angular
    .module('nerveCenter')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', 'auth'];
  function loginCtrl($location, auth) {
    var vm = this;

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.onSubmit = function() {
      auth
        .login(vm.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
    };
  }
})();

