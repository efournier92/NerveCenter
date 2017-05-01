(function () {

  angular
    .module('nerveCenter')
    .service('meanData', meanData);

  meanData.$inject = ['$http', 'auth'];
  function meanData($http, auth) {

    var getProfile = function () {
      return $http.get('/api/user', {
        headers: {
          Authorization: 'Bearer '+ auth.getToken()
        }
      });
    };

    var updateWidgets = function(data) {
      return $http.put('/api/user', data, {
        headers: {
          Authorization: 'Bearer '+ auth.getToken()
        }
      });
    };

    var getIcons = function(data) {
      return $http.get('/api/ico', data, {
        headers: {
          Authorization: 'Bearer '+ auth.getToken()
        }
      });
    };

    return {
      getProfile : getProfile,
      updateWidgets: updateWidgets,
      getIcons: getIcons 
    };

  }

})();

