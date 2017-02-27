(function() {

  angular
    .module('nerveCenter')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'authentication'];
  function meanData($http, authentication) {

    var getProfile = function() {
      return $http.get('/api/profile', {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    var updateWidgets = function() {
      $http( {
        method: 'PUT',
        url: '/api/profile/58b243dc0c75e6925e981268',
        headers: {
          Authorization: 'Bearer ' + authentication.getToken()
        },
        data: { test: 'test' }
      }).then(function successCallback(response) {
        $log.log("OK")
      }, function errorCallback(response) {
        if(response.status = 401){ // If you have set 401
          $log.log("ohohoh")
        }
      });
      return $http.put('/api/profile/' + authentication.currentUser().id, {
        headers: {
          Authorization: 'Bearer '+ authentication.getToken()
        }
      });
    };

    return {
      getProfile : getProfile,
      updateWidgets: updateWidgets
    };
  }

})();
