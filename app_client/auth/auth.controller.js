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
        .error(function(err) {
          alert("Sorry, you didn't fill in both fields.\nPlease try again.");
        })
        .then(function () {
          auth.login($auth.credentials)
          $location.path('../dashboard/dashboard.view');
        });
    };

    $auth.user = {};

    $auth.onLogin = function () {
      auth
        .login($auth.credentials)
        .error(function(err) {
          alert("Sorry, the username and password you entered don't match.\nPlease try again.");
        })
        .then(function () {
          $location.path('../dashboard/dashboard.view');
        });
    }
  }

})();
