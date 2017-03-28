(function () {

  angular
    .module('nerveCenter')
    .controller('authCtrl', authCtrl);

  authCtrl.$inject = ['$location', 'auth', 'meanData'];
  function authCtrl($location, auth, meanData) {
    var $auth = this;

    $auth.credentials = {
      email : "",
      password : ""
    };

    $auth.onReg = function() {
      auth
        .register($auth.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('../dashboard/dashboard.view');
        });
    };
    
    $auth.user = {};

    $auth.onLogin = function() {
      auth
        .login($auth.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('../dashboard/dashboard.view');
        });
    }
  }

})();
