(function() {

  angular
    .module('nerveCenter')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'auth'];
  function meanData($http, auth) {

    var getProfile = function() {
      return $http.get('/api/user', {
        headers: {
          Authorization: 'Bearer '+ auth.getToken()
        }
      });
    };

    var updateWidgets = function() {
      $http({
        method: 'PUT',
        url: '/api/user/' + auth.currentUser().id,
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        },
        data: {'STRING!': 'string'} 
      }).then(function successCallback(res) {
        console.log("Widget Updated:", res)
      }, function errorCallback(res) {
        if(res.status = 401){
          console.error("Unauthorized User")
        }
      });
      return $http.put('/api/user/' + auth.currentUser().id, {
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

