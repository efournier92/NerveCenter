(function () {

  angular
    .module('nerveCenter')
    .controller('authCtrl', authCtrl);

  authCtrl.$inject = ['$location', 'auth', 'meanData'];
  function authCtrl($location, auth, meanData) {
    var $auth = this;

    $auth.credentials = {
      name : "",
      email : "",
      password : ""
    };

    $auth.user = {};

    $auth.onSubmit = function () {
      auth
        .register($auth.credentials)
        .error(function(err){
          alert(err);
        })
        .then(function(){
          $location.path('profile');
        });
    };

    meanData.getProfile()
      .success(function(data) {
        $auth.user = data;
      })
      .error(function (e) {
        console.log(e);
      });
  }
})();
