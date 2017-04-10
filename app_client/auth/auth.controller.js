(function () {

  angular
    .module('nerveCenter')
    .controller('authCtrl', authCtrl);

  authCtrl.$inject = ['$location', 'auth', 'apiData'];
  function authCtrl($location, auth, apiData) {
    var $auth = this;

    $auth.credentials = {
      email : "",
      password : ""
    };

    $auth.onReg = function () {
      auth
        .register($auth.credentials)
        .error(function(err){
          alert("Sorry, you didn't fill in both fields");
        })
        .then(function (){
          $location.path('../dashboard/dashboard.view');
        });
    };
    
    $auth.user = {};

    $auth.onLogin = function () {
      auth
        .login($auth.credentials)
        .error(function(err){
          alert("Sorry, I don't know that combination.\nPlease try again");
        })
        .then(function (){
          $location.path('../dashboard/dashboard.view');
        });
    }
  }

})();
