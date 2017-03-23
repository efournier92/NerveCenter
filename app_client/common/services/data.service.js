(function() {

  angular
    .module('nerveCenter')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'auth'];
  function meanData($http, auth) {

    var getProfile = function() {
      return $http.get('/api/profile', {
        headers: {
          Authorization: 'Bearer '+ auth.getToken()
        }
      });
    };

    var updateWidgets = function() {
      $http({
        method: 'PUT',
        url: '/api/profile/' + auth.currentUser().id,
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        },
        data: {'STRING!': 'string'} 
      }).then(function successCallback(response) {
        console.log("OK")
      }, function errorCallback(response) {
        if(response.status = 401){
          console.error("UNAUTHORIZED USER")
        }
      });
      return $http.put('/api/profile/' + auth.currentUser().id, {
        headers: {
          Authorization: 'Bearer '+ auth.getToken()
        }
      });
    };

    return {
      getProfile : getProfile,
      updateWidgets: updateWidgets
    };
  }

})();

