(function() {

  angular
    .module('nerveCenter')
    .controller('loginCtrl', loginCtrl);

  loginCtrl.$inject = ['$location', 'auth'];
  function loginCtrl($location, auth) {
    var $reg = this;

    $reg.credentials = {
      email : "",
      password : ""
    };

    $reg.onSubmit = function() {
      auth
        .login($reg.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
    };
  }

})();

