(function () {

  angular
    .module('nerveCenter')
    .controller('registerCtrl', registerCtrl);

  registerCtrl.$inject = ['$location', 'auth'];
  function registerCtrl($location, auth) {
    var vm = this;

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      console.log('Submitting registration');
      auth
        .register(vm.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
    };
  }
})();
